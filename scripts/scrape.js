/**
 * fine:D — 공모·지원사업 자동 수집 스크립트
 * 대상: 한국문화예술위원회(ARKO), 서울문화재단, 경기문화재단,
 *       한국콘텐츠진흥원, 영화진흥위원회, 대산문화재단
 *
 * 실행:
 *   node scrape.js           → Firestore 저장
 *   node scrape.js --dry-run → 콘솔 출력만 (저장 안 함)
 *
 * 환경변수:
 *   FIREBASE_SERVICE_ACCOUNT  Firebase 서비스 계정 JSON (문자열)
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
      'User-Agent': 'Mozilla/5.0 (compatible; FineBot/1.0)',
      'Accept-Language': 'ko-KR,ko;q=0.9',
    },
  })
  return data
}

// ── 날짜 파싱 헬퍼 ───────────────────────────────────────────────
function parseDate(str) {
  if (!str) return null
  const cleaned = str.replace(/[^\d\-\.\/]/g, '').trim()
  const m = cleaned.match(/(\d{4})[\-\.\/ ]?(\d{2})[\-\.\/ ]?(\d{2})/)
  if (!m) return null
  return new Date(+m[1], +m[2] - 1, +m[3])
}

// ── rawText 추출 헬퍼 ────────────────────────────────────────────
// 상세 페이지에서 본문 텍스트를 추출. 실패해도 빈 문자열 반환
async function fetchRawText(url) {
  if (!url) return ''
  try {
    const html = await fetch(url)
    const $ = cheerio.load(html)
    // 네비게이션·헤더·푸터 제거 후 텍스트 추출
    $('nav, header, footer, script, style, .nav, .header, .footer, .gnb, .lnb').remove()
    const text = $('body').text().replace(/\s+/g, ' ').trim()
    return text.slice(0, 5000) // 최대 5000자
  } catch {
    return ''
  }
}

// ── 중복 체크 (title + organization + deadline 3중 기준) ─────────
async function findExisting(db, title, organization, deadline) {
  if (!db) return null

  // deadline이 있으면 3중 체크, 없으면 2중 체크
  if (deadline) {
    const deadlineTs = admin.firestore.Timestamp.fromDate(deadline)
    const snap = await db.collection('competitions')
      .where('title', '==', title)
      .where('organization', '==', organization)
      .where('deadline', '==', deadlineTs)
      .limit(1)
      .get()
    if (!snap.empty) return snap.docs[0]
  }

  // deadline 없는 경우 title + organization만 체크
  const snap = await db.collection('competitions')
    .where('title', '==', title)
    .where('organization', '==', organization)
    .limit(1)
    .get()
  return snap.empty ? null : snap.docs[0]
}

// ── Firestore 저장 (신규 추가 또는 변경 업데이트) ────────────────
async function save(db, item) {
  const now = IS_DRY_RUN ? new Date() : admin.firestore.Timestamp.now()

  if (IS_DRY_RUN) {
    console.log('[DRY-RUN]', JSON.stringify(item, null, 2))
    return 'new'
  }

  const deadline = item.deadline instanceof Date
    ? admin.firestore.Timestamp.fromDate(item.deadline)
    : null
  const startDate = item.startDate instanceof Date
    ? admin.firestore.Timestamp.fromDate(item.startDate)
    : null

  const existing = await findExisting(db, item.title, item.organization, item.deadline)

  if (existing) {
    // 기존 문서 — rawText 등 변경사항만 업데이트
    await existing.ref.update({ updatedAt: now, rawText: item.rawText || existing.data().rawText })
    console.log(`  ↻  업데이트: ${item.title}`)
    return 'updated'
  }

  // 신규 저장
  await db.collection('competitions').add({
    ...item,
    deadline,
    startDate,
    isActive: true,
    source: 'scraper',
    processedAt: null,
    createdAt: now,
    updatedAt: now,
  })
  console.log(`  ✅ 저장: ${item.title}`)
  return 'new'
}

// ── 마감 공고 자동 비활성화 ───────────────────────────────────────
async function deactivateExpired(db) {
  if (!db) return
  const now = admin.firestore.Timestamp.now()
  const snap = await db.collection('competitions')
    .where('isActive', '==', true)
    .where('deadline', '<', now)
    .get()

  if (snap.empty) {
    console.log('\n[CLEANUP] 비활성화할 마감 공고 없음')
    return
  }

  const batch = db.batch()
  snap.forEach(doc => {
    batch.update(doc.ref, { isActive: false, updatedAt: now })
  })
  await batch.commit()
  console.log(`\n[CLEANUP] 마감 공고 ${snap.size}건 비활성화 완료`)
}

// ════════════════════════════════════════════════════════════════
// 스크래퍼 목록
// ════════════════════════════════════════════════════════════════

const SCRAPERS = [

  // ── 1. 한국문화예술위원회(ARKO) 지원사업 공고 ──────────────────
  {
    name: '한국문화예술위원회(ARKO)',
    url: 'https://www.arko.or.kr/lay1/program/S1T27C32/artsupport/list.do',
    baseUrl: 'https://www.arko.or.kr',
    async parse(html) {
      const $ = cheerio.load(html)
      const items = []

      $('table.tbl-list tbody tr, .board-list tbody tr, tbody tr').each((_, tr) => {
        const tds = $(tr).find('td')
        if (tds.length < 3) return

        const titleEl = $(tr).find('a').first()
        const title   = titleEl.text().trim()
        if (!title || title.length < 5) return

        let deadlineStr = '', startDateStr = ''
        const dates = []
        tds.each((_, td) => {
          const t = $(td).text().trim()
          if (/\d{4}[\.\-]\d{2}[\.\-]\d{2}/.test(t)) dates.push(t)
        })
        if (dates.length >= 2) { startDateStr = dates[0]; deadlineStr = dates[1] }
        else if (dates.length === 1) { deadlineStr = dates[0] }

        const href = titleEl.attr('href') || ''
        const detailUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`

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
          startDate: parseDate(startDateStr),
          deadline: parseDate(deadlineStr),
          description: 'ARKO 공식 사이트에서 상세 내용을 확인하세요.',
          rawText: '',
          _detailUrl: detailUrl,
        })
      })
      return items
    },
  },

  // ── 2. 서울문화재단 지원사업 공고 ─────────────────────────────
  {
    name: '서울문화재단',
    url: 'https://www.sfac.or.kr/site/sfac/board/list.do?menuIdx=1043',
    baseUrl: 'https://www.sfac.or.kr',
    async parse(html) {
      const $ = cheerio.load(html)
      const items = []

      $('.board_list tbody tr, table tbody tr').each((_, tr) => {
        const titleEl = $(tr).find('a').first()
        const title   = titleEl.text().trim()
        if (!title || title.length < 5) return

        let deadlineStr = '', startDateStr = ''
        const dates = []
        $(tr).find('td').each((_, td) => {
          const t = $(td).text().trim()
          if (/\d{4}[\.\-]\d{2}[\.\-]\d{2}/.test(t)) dates.push(t)
        })
        if (dates.length >= 2) { startDateStr = dates[0]; deadlineStr = dates[1] }
        else if (dates.length === 1) { deadlineStr = dates[0] }

        const href = titleEl.attr('href') || ''
        const detailUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`

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
          startDate: parseDate(startDateStr),
          deadline: parseDate(deadlineStr),
          description: '서울문화재단 공식 사이트에서 상세 내용을 확인하세요.',
          rawText: '',
          _detailUrl: detailUrl,
        })
      })
      return items
    },
  },

  // ── 3. 경기문화재단 지원사업 공고 ─────────────────────────────
  {
    name: '경기문화재단',
    url: 'https://www.ggcf.kr/main/contents.do?key=248',
    baseUrl: 'https://www.ggcf.kr',
    async parse(html) {
      const $ = cheerio.load(html)
      const items = []

      $('ul.board-list li, table tbody tr').each((_, el) => {
        const titleEl = $(el).find('a').first()
        const title   = titleEl.text().trim()
        if (!title || title.length < 5) return

        const text = $(el).text()
        const allDates = [...text.matchAll(/\d{4}[\.\-]\d{2}[\.\-]\d{2}/g)].map(m => m[0])
        const startDateStr = allDates[0] || ''
        const deadlineStr  = allDates[1] || allDates[0] || ''

        const href = titleEl.attr('href') || ''
        const detailUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`

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
          startDate: parseDate(startDateStr),
          deadline: parseDate(deadlineStr),
          description: '경기문화재단 공식 사이트에서 상세 내용을 확인하세요.',
          rawText: '',
          _detailUrl: detailUrl,
        })
      })
      return items
    },
  },

  // ── 4. 한국콘텐츠진흥원(KOCCA) 지원사업 공고 ──────────────────
  {
    name: '한국콘텐츠진흥원(KOCCA)',
    url: 'https://www.kocca.kr/kocca/biz/about.do',
    baseUrl: 'https://www.kocca.kr',
    async parse(html) {
      const $ = cheerio.load(html)
      const items = []

      $('.board_list tbody tr, table tbody tr, ul li').each((_, el) => {
        const titleEl = $(el).find('a').first()
        const title   = titleEl.text().trim()
        if (!title || title.length < 5) return

        const text = $(el).text()
        const allDates = [...text.matchAll(/\d{4}[\.\-]\d{2}[\.\-]\d{2}/g)].map(m => m[0])
        const startDateStr = allDates[0] || ''
        const deadlineStr  = allDates[1] || allDates[0] || ''

        const href = titleEl.attr('href') || ''
        const detailUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`

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
          startDate: parseDate(startDateStr),
          deadline: parseDate(deadlineStr),
          description: '한국콘텐츠진흥원 공식 사이트에서 상세 내용을 확인하세요.',
          rawText: '',
          _detailUrl: detailUrl,
        })
      })
      return items
    },
  },

  // ── 5. 영화진흥위원회(KOFIC) 공모 공고 ────────────────────────
  {
    name: '영화진흥위원회(KOFIC)',
    url: 'https://www.kofic.or.kr/kofic/business/pubs/selectPublsBoardList.do',
    baseUrl: 'https://www.kofic.or.kr',
    async parse(html) {
      const $ = cheerio.load(html)
      const items = []

      $('table tbody tr, .list-table tbody tr').each((_, tr) => {
        const titleEl = $(tr).find('a').first()
        const title   = titleEl.text().trim()
        if (!title || title.length < 5) return

        let deadlineStr = '', startDateStr = ''
        const dates = []
        $(tr).find('td').each((_, td) => {
          const t = $(td).text().trim()
          if (/\d{4}[\.\-]\d{2}[\.\-]\d{2}/.test(t)) dates.push(t)
        })
        if (dates.length >= 2) { startDateStr = dates[0]; deadlineStr = dates[1] }
        else if (dates.length === 1) { deadlineStr = dates[0] }

        const href = titleEl.attr('href') || ''
        const detailUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`

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
          startDate: parseDate(startDateStr),
          deadline: parseDate(deadlineStr),
          description: '영화진흥위원회 공식 사이트에서 상세 내용을 확인하세요.',
          rawText: '',
          _detailUrl: detailUrl,
        })
      })
      return items
    },
  },

  // ── 6. 대산문화재단 문학 공모 ──────────────────────────────────
  {
    name: '대산문화재단',
    url: 'https://www.daesan.or.kr/news/notice.html',
    baseUrl: 'https://www.daesan.or.kr',
    async parse(html) {
      const $ = cheerio.load(html)
      const items = []

      $('table tbody tr, ul.board li').each((_, el) => {
        const titleEl = $(el).find('a').first()
        const title   = titleEl.text().trim()
        if (!title || title.length < 5) return

        const text = $(el).text()
        const allDates = [...text.matchAll(/\d{4}[\.\-]\d{2}[\.\-]\d{2}/g)].map(m => m[0])
        const startDateStr = allDates[0] || ''
        const deadlineStr  = allDates[1] || allDates[0] || ''

        const href = titleEl.attr('href') || ''
        const detailUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`

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
          startDate: parseDate(startDateStr),
          deadline: parseDate(deadlineStr),
          description: '대산문화재단 공식 사이트에서 상세 내용을 확인하세요.',
          rawText: '',
          _detailUrl: detailUrl,
        })
      })
      return items
    },
  },

]

// ── 메인 실행 ─────────────────────────────────────────────────────
async function main() {
  const startedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
  console.log(`\n[${startedAt}] fine:D — 공모·지원사업 수집 시작 (${IS_DRY_RUN ? 'DRY-RUN' : '실제 저장'})\n`)

  const db = initFirebase()
  let totalParsed = 0, totalNew = 0, totalUpdated = 0, totalFailed = 0

  // 1단계: 마감 공고 비활성화
  await deactivateExpired(db)

  // 2단계: 각 소스 크롤링
  for (const scraper of SCRAPERS) {
    console.log(`\n[${scraper.name}] 수집 중...`)
    let scraperNew = 0, scraperUpdated = 0, scraperFailed = 0

    try {
      const html  = await fetch(scraper.url)
      const items = await scraper.parse(html)
      console.log(`   ${items.length}건 파싱됨`)
      totalParsed += items.length

      for (const item of items) {
        try {
          // rawText 수집 (상세 페이지, 실패해도 계속 진행)
          if (item._detailUrl) {
            item.rawText = await fetchRawText(item._detailUrl)
            delete item._detailUrl
          }

          const result = await save(db, item)
          if (result === 'new') scraperNew++
          else if (result === 'updated') scraperUpdated++
        } catch (e) {
          scraperFailed++
          console.error(`   ❌ 저장 실패: ${item.title} — ${e.message}`)
        }
      }
    } catch (e) {
      console.error(`   ⚠️  수집 실패: ${e.message}`)
    }

    console.log(`   → 새 공고 ${scraperNew}건, 업데이트 ${scraperUpdated}건, 실패 ${scraperFailed}건`)
    totalNew += scraperNew
    totalUpdated += scraperUpdated
    totalFailed += scraperFailed
  }

  const endedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
  console.log(`\n[${endedAt}] 수집 완료 — 총 파싱 ${totalParsed}건 / 새 공고 ${totalNew}건 / 업데이트 ${totalUpdated}건 / 실패 ${totalFailed}건\n`)
}

main().catch(e => { console.error(e); process.exit(1) })
