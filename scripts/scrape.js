/**
 * 모두의 예술 — 공모·지원사업 자동 수집 스크립트
 * 대상: 한국문화예술위원회(ARKO), 서울문화재단, 경기문화재단, 한국콘텐츠진흥원
 *
 * 실행:
 *   node scrape.js           → Firestore 저장
 *   node scrape.js --dry-run → 콘솔 출력만 (저장 안 함)
 *
 * 환경변수:
 *   FIREBASE_SERVICE_ACCOUNT  Firebase 서비스 계정 JSON (문자열)
 *   FIREBASE_PROJECT_ID       Firebase 프로젝트 ID
 */

'use strict'

const axios   = require('axios')
const cheerio = require('cheerio')
const admin   = require('firebase-admin')

const IS_DRY_RUN = process.argv.includes('--dry-run')

// ── Firebase 초기화 ──────────────────────────────────────────────
function initFirebase() {
  if (IS_DRY_RUN) return null
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!sa) throw new Error('FIREBASE_SERVICE_ACCOUNT 환경변수가 없습니다.')
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(sa)) })
  return admin.firestore()
}

// ── HTTP 헬퍼 ────────────────────────────────────────────────────
async function fetch(url) {
  const { data } = await axios.get(url, {
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ModuArtBot/1.0)',
      'Accept-Language': 'ko-KR,ko;q=0.9',
    },
  })
  return data
}

// ── 날짜 파싱 헬퍼 ───────────────────────────────────────────────
function parseDate(str) {
  if (!str) return null
  const cleaned = str.replace(/[^\d\-\.\/]/g, '').trim()
  // 2026.04.30 / 2026-04-30 / 20260430
  const m = cleaned.match(/(\d{4})[\-\.\/ ]?(\d{2})[\-\.\/ ]?(\d{2})/)
  if (!m) return null
  return new Date(+m[1], +m[2] - 1, +m[3])
}

// ── 중복 체크 ────────────────────────────────────────────────────
async function isDuplicate(db, title, organization) {
  if (!db) return false
  const snap = await db.collection('competitions')
    .where('title', '==', title)
    .where('organization', '==', organization)
    .limit(1)
    .get()
  return !snap.empty
}

// ── Firestore 저장 ────────────────────────────────────────────────
async function save(db, item) {
  if (IS_DRY_RUN) {
    console.log('[DRY-RUN]', JSON.stringify(item, null, 2))
    return
  }
  if (await isDuplicate(db, item.title, item.organization)) {
    console.log(`  ⏭  중복 건너뜀: ${item.title}`)
    return
  }
  const deadline = item.deadline instanceof Date
    ? admin.firestore.Timestamp.fromDate(item.deadline)
    : null
  await db.collection('competitions').add({
    ...item,
    deadline,
    isActive: true,
    source: 'scraper',
    createdAt: admin.firestore.Timestamp.now(),
  })
  console.log(`  ✅ 저장: ${item.title}`)
}

// ════════════════════════════════════════════════════════════════
// 스크래퍼 목록
// ════════════════════════════════════════════════════════════════

const SCRAPERS = [

  // ── 1. 한국문화예술위원회(ARKO) 지원사업 공고 ──────────────────
  {
    name: '한국문화예술위원회(ARKO)',
    url: 'https://www.arko.or.kr/lay1/program/S1T27C32/artsupport/list.do',
    async parse(html) {
      const $ = cheerio.load(html)
      const items = []

      // ARKO 공고 테이블: .tbl-list tbody tr
      $('table.tbl-list tbody tr, .board-list tbody tr, tbody tr').each((_, tr) => {
        const tds = $(tr).find('td')
        if (tds.length < 3) return

        // 링크가 있는 셀에서 제목 추출
        const titleEl = $(tr).find('a').first()
        const title   = titleEl.text().trim()
        if (!title || title.length < 5) return

        // 마감일 — 날짜 형식 셀 찾기
        let deadlineStr = ''
        tds.each((_, td) => {
          const t = $(td).text().trim()
          if (/\d{4}[\.\-]\d{2}[\.\-]\d{2}/.test(t)) deadlineStr = t
        })

        const href = titleEl.attr('href') || ''
        const detailUrl = href.startsWith('http') ? href : `https://www.arko.or.kr${href}`

        items.push({
          title,
          organization: '한국문화예술위원회',
          orgUrl: detailUrl,
          category: '전 분야',
          type: '지원사업',
          fields: [],
          targetGroup: ['개인', '단체'],
          amount: '공고 참조',
          region: '전국',
          deadline: parseDate(deadlineStr),
          description: 'ARKO 공식 사이트에서 상세 내용을 확인하세요.',
        })
      })
      return items
    },
  },

  // ── 2. 서울문화재단 지원사업 공고 ─────────────────────────────
  {
    name: '서울문화재단',
    url: 'https://www.sfac.or.kr/site/sfac/board/list.do?menuIdx=1043',
    async parse(html) {
      const $ = cheerio.load(html)
      const items = []

      $('.board_list tbody tr, table tbody tr').each((_, tr) => {
        const titleEl = $(tr).find('a').first()
        const title   = titleEl.text().trim()
        if (!title || title.length < 5) return

        let deadlineStr = ''
        $(tr).find('td').each((_, td) => {
          const t = $(td).text().trim()
          if (/\d{4}[\.\-]\d{2}[\.\-]\d{2}/.test(t)) deadlineStr = t
        })

        const href = titleEl.attr('href') || ''
        const detailUrl = href.startsWith('http') ? href : `https://www.sfac.or.kr${href}`

        items.push({
          title,
          organization: '서울문화재단',
          orgUrl: detailUrl,
          category: '전 분야',
          type: '지원사업',
          fields: [],
          targetGroup: ['개인', '단체'],
          amount: '공고 참조',
          region: '서울',
          deadline: parseDate(deadlineStr),
          description: '서울문화재단 공식 사이트에서 상세 내용을 확인하세요.',
        })
      })
      return items
    },
  },

  // ── 3. 경기문화재단 지원사업 공고 ─────────────────────────────
  {
    name: '경기문화재단',
    url: 'https://www.ggcf.kr/main/contents.do?key=248',
    async parse(html) {
      const $ = cheerio.load(html)
      const items = []

      $('ul.board-list li, table tbody tr').each((_, el) => {
        const titleEl = $(el).find('a').first()
        const title   = titleEl.text().trim()
        if (!title || title.length < 5) return

        let deadlineStr = ''
        const text = $(el).text()
        const m = text.match(/\d{4}[\.\-]\d{2}[\.\-]\d{2}/)
        if (m) deadlineStr = m[0]

        const href = titleEl.attr('href') || ''
        const detailUrl = href.startsWith('http') ? href : `https://www.ggcf.kr${href}`

        items.push({
          title,
          organization: '경기문화재단',
          orgUrl: detailUrl,
          category: '전 분야',
          type: '지원사업',
          fields: [],
          targetGroup: ['개인', '단체'],
          amount: '공고 참조',
          region: '경기',
          deadline: parseDate(deadlineStr),
          description: '경기문화재단 공식 사이트에서 상세 내용을 확인하세요.',
        })
      })
      return items
    },
  },

  // ── 4. 한국콘텐츠진흥원(KOCCA) 지원사업 공고 ──────────────────
  {
    name: '한국콘텐츠진흥원(KOCCA)',
    url: 'https://www.kocca.kr/kocca/biz/about.do',
    async parse(html) {
      const $ = cheerio.load(html)
      const items = []

      $('.board_list tbody tr, table tbody tr, ul li').each((_, el) => {
        const titleEl = $(el).find('a').first()
        const title   = titleEl.text().trim()
        if (!title || title.length < 5) return

        let deadlineStr = ''
        const text = $(el).text()
        const m = text.match(/\d{4}[\.\-]\d{2}[\.\-]\d{2}/)
        if (m) deadlineStr = m[0]

        const href = titleEl.attr('href') || ''
        const detailUrl = href.startsWith('http') ? href : `https://www.kocca.kr${href}`

        items.push({
          title,
          organization: '한국콘텐츠진흥원',
          orgUrl: detailUrl,
          category: '영상·미디어',
          type: '지원사업',
          fields: [],
          targetGroup: ['개인', '단체'],
          amount: '공고 참조',
          region: '전국',
          deadline: parseDate(deadlineStr),
          description: '한국콘텐츠진흥원 공식 사이트에서 상세 내용을 확인하세요.',
        })
      })
      return items
    },
  },

  // ── 5. 영화진흥위원회(KOFIC) 공모 공고 ────────────────────────
  {
    name: '영화진흥위원회(KOFIC)',
    url: 'https://www.kofic.or.kr/kofic/business/pubs/selectPublsBoardList.do',
    async parse(html) {
      const $ = cheerio.load(html)
      const items = []

      $('table tbody tr, .list-table tbody tr').each((_, tr) => {
        const titleEl = $(tr).find('a').first()
        const title   = titleEl.text().trim()
        if (!title || title.length < 5) return

        let deadlineStr = ''
        $(tr).find('td').each((_, td) => {
          const t = $(td).text().trim()
          if (/\d{4}[\.\-]\d{2}[\.\-]\d{2}/.test(t)) deadlineStr = t
        })

        const href = titleEl.attr('href') || ''
        const detailUrl = href.startsWith('http') ? href : `https://www.kofic.or.kr${href}`

        items.push({
          title,
          organization: '영화진흥위원회',
          orgUrl: detailUrl,
          category: '영상·미디어',
          type: '지원사업',
          fields: ['독립영화', '단편영화'],
          targetGroup: ['개인', '단체'],
          amount: '공고 참조',
          region: '전국',
          deadline: parseDate(deadlineStr),
          description: '영화진흥위원회 공식 사이트에서 상세 내용을 확인하세요.',
        })
      })
      return items
    },
  },

  // ── 6. 대산문화재단 문학 공모 ──────────────────────────────────
  {
    name: '대산문화재단',
    url: 'https://www.daesan.or.kr/news/notice.html',
    async parse(html) {
      const $ = cheerio.load(html)
      const items = []

      $('table tbody tr, ul.board li').each((_, el) => {
        const titleEl = $(el).find('a').first()
        const title   = titleEl.text().trim()
        if (!title || title.length < 5) return

        let deadlineStr = ''
        const text = $(el).text()
        const m = text.match(/\d{4}[\.\-]\d{2}[\.\-]\d{2}/)
        if (m) deadlineStr = m[0]

        const href = titleEl.attr('href') || ''
        const detailUrl = href.startsWith('http') ? href : `https://www.daesan.or.kr${href}`

        items.push({
          title,
          organization: '대산문화재단',
          orgUrl: detailUrl,
          category: '문학',
          type: '지원사업',
          fields: ['시', '소설', '희곡', '평론', '번역'],
          targetGroup: ['개인'],
          amount: '공고 참조',
          region: '전국',
          deadline: parseDate(deadlineStr),
          description: '대산문화재단 공식 사이트에서 상세 내용을 확인하세요.',
        })
      })
      return items
    },
  },

]

// ── 메인 실행 ─────────────────────────────────────────────────────
async function main() {
  console.log(`\n🎨 모두의 예술 — 공모·지원사업 수집 시작 (${IS_DRY_RUN ? 'DRY-RUN' : '실제 저장'})\n`)
  const db = initFirebase()
  let total = 0, saved = 0

  for (const scraper of SCRAPERS) {
    console.log(`\n📌 ${scraper.name} 수집 중...`)
    try {
      const html  = await fetch(scraper.url)
      const items = await scraper.parse(html)
      console.log(`   ${items.length}건 파싱됨`)
      total += items.length

      for (const item of items) {
        try {
          await save(db, item)
          saved++
        } catch (e) {
          console.error(`   ❌ 저장 실패: ${item.title} — ${e.message}`)
        }
      }
    } catch (e) {
      console.error(`   ⚠️  ${scraper.name} 수집 실패: ${e.message}`)
    }
  }

  console.log(`\n✨ 완료 — 총 파싱 ${total}건 / 저장(시도) ${saved}건\n`)
}

main().catch(e => { console.error(e); process.exit(1) })
