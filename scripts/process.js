/**
 * fine:D — LLM 후처리 파이프라인
 * processedAt == null 인 공고의 rawText를 Claude Haiku로 분석해
 * eligibility, tags, supportType, documents 필드를 추출하여 Firestore 업데이트
 *
 * 실행:
 *   node process.js           → 실제 처리
 *   node process.js --dry-run → API 호출 없이 대상 문서 목록만 출력
 *   node process.js --limit N → 최대 N건만 처리 (기본값: 50)
 *
 * 환경변수:
 *   FIREBASE_SERVICE_ACCOUNT  Firebase 서비스 계정 JSON (문자열)
 *   ANTHROPIC_API_KEY         Claude API 키
 */

'use strict'

const Anthropic = require('@anthropic-ai/sdk')
const admin     = require('firebase-admin')

const IS_DRY_RUN = process.argv.includes('--dry-run')
const LIMIT_ARG  = (() => {
  const idx = process.argv.indexOf('--limit')
  return idx !== -1 ? parseInt(process.argv[idx + 1], 10) || 50 : 50
})()

// ── 60개 토픽 체계 ────────────────────────────────────────────────
const TOPIC_LIST = [
  // 창작/제작 지원
  '창작비', '제작비', '연구/리서치', '프로젝트 지원', '신작 개발', '시범제작',
  // 발표/상영/공연
  '전시', '개인전', '단체전', '공연', '쇼케이스', '리딩/낭독', '상영', '페스티벌 참가',
  // 공간/레지던시
  '레지던시', '작업실/스튜디오', '공연장/대관', '전시장/대관', '리허설룸', '장비/시설 지원',
  // 유통/홍보/마케팅
  '유통/배급', '홍보/PR', '마케팅', '콘텐츠 제작', '아카이빙', '기록/도록', '번역/자막',
  // 교육/성장
  '멘토링', '컨설팅', '워크숍', '교육/강의', '네트워킹', '피칭', '심사/리뷰',
  // 해외/교류
  '해외진출', '국제교류', '투어', '해외 레지던시', '공동제작', '교류전/교류공연',
  // 대상/트랙
  '신진', '청년', '중견', '지역예술인', '장애예술인', '여성', '단체', '개인', '사업자', '비사업자',
  // 시각예술 매체
  '회화', '조각', '설치', '사진', '드로잉', '판화', '공예', '디자인', '미디어아트',
  // 공연예술/음악 매체
  '연극', '무용', '음악', '국악', '뮤지컬', '퍼포먼스',
  // 문학/출판
  '소설', '시', '에세이', '희곡', '출판', '창작집/선집',
  // 영상/디지털
  '영화', '다큐멘터리', '애니메이션', '영상콘텐츠', '웹/인터랙티브',
  // 커뮤니티/공공성
  '커뮤니티', '지역문화', '예술교육', '참여예술', '공공예술', '사회적 가치',
  // 테마/키워드
  '환경', '기술', '인공지능', '아동/청소년', '노년', '다문화',
]

// ── Firebase 초기화 ──────────────────────────────────────────────
function initFirebase() {
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!sa) throw new Error('FIREBASE_SERVICE_ACCOUNT 환경변수가 없습니다.')
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(sa)) })
  return admin.firestore()
}

// ── Claude Haiku 호출 ─────────────────────────────────────────────
async function extractWithLLM(client, rawText) {
  const prompt = `당신은 문화예술 공모·지원사업 공고를 분석하는 전문가입니다.
아래 공고 원문을 읽고, 다음 정보를 JSON으로 추출하세요.

## 추출 항목

1. eligibility (자격요건):
   - age: 연령 조건 (없으면 "무관")
   - region: 지역 제한 배열 (없으면 [])
   - career: 경력 조건 (없으면 "무관")
   - entityType: "개인" | "단체" | "법인" | "무관"
   - hasBusiness: 사업자 등록 필요 여부 (true / false / null)
   - other: 위에 해당하지 않는 기타 자격요건 (없으면 "")

2. tags: 아래 토픽 목록에서 해당하는 것을 모두 선택 (배열, 최대 10개)
   ${TOPIC_LIST.join(', ')}

3. supportType: 지원 형태 배열 (예: ["창작비", "공간지원", "멘토링"])

4. documents: 제출서류 목록 배열 (예: ["사업계획서", "포트폴리오", "경력증명서"])

## 규칙
- 공고에 명시되지 않은 정보는 추측하지 말 것
- tags는 반드시 제공된 토픽 목록 내에서만 선택할 것
- JSON만 출력하고 다른 텍스트는 포함하지 말 것
- 출력 형식: {"eligibility":{...},"tags":[...],"supportType":[...],"documents":[...]}

## 공고 원문:
${rawText.slice(0, 3000)}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].text.trim()

  // JSON 추출 (```json ... ``` 감싸인 경우 대응)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('JSON 파싱 실패: ' + text.slice(0, 100))
  return JSON.parse(jsonMatch[0])
}

// ── 단일 문서 처리 ────────────────────────────────────────────────
async function processDoc(client, db, docSnap) {
  const data = docSnap.data()
  const rawText = data.rawText || ''

  if (!rawText || rawText.length < 50) {
    // rawText가 너무 짧으면 처리 불가 — processedAt에 마커 기록
    await docSnap.ref.update({
      processedAt: admin.firestore.Timestamp.now(),
      processingNote: 'rawText 없음 또는 너무 짧음',
    })
    return 'skipped'
  }

  let extracted
  try {
    extracted = await extractWithLLM(client, rawText)
  } catch (e) {
    // 1회 재시도
    try {
      extracted = await extractWithLLM(client, rawText)
    } catch (e2) {
      console.error(`   ❌ LLM 실패: ${data.title} — ${e2.message}`)
      return 'failed'
    }
  }

  const now = admin.firestore.Timestamp.now()
  await docSnap.ref.update({
    eligibility:  extracted.eligibility  || null,
    tags:         Array.isArray(extracted.tags) ? extracted.tags : [],
    supportType:  Array.isArray(extracted.supportType) ? extracted.supportType : [],
    documents:    Array.isArray(extracted.documents) ? extracted.documents : [],
    processedAt:  now,
    updatedAt:    now,
  })
  return 'done'
}

// ── 메인 실행 ─────────────────────────────────────────────────────
async function main() {
  const startedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
  console.log(`\n[${startedAt}] fine:D — LLM 후처리 시작 (${IS_DRY_RUN ? 'DRY-RUN' : '실제 처리'}, 최대 ${LIMIT_ARG}건)\n`)

  if (IS_DRY_RUN) {
    const db = initFirebase()
    const snap = await db.collection('competitions')
      .where('processedAt', '==', null)
      .limit(LIMIT_ARG)
      .get()
    console.log(`[DRY-RUN] 처리 대기 문서: ${snap.size}건`)
    snap.forEach(doc => console.log(`  - ${doc.data().title} (${doc.data().organization})`))
    return
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY 환경변수가 없습니다.')
  }

  const db     = initFirebase()
  const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })

  const snap = await db.collection('competitions')
    .where('processedAt', '==', null)
    .limit(LIMIT_ARG)
    .get()

  console.log(`처리 대기: ${snap.size}건\n`)

  let done = 0, skipped = 0, failed = 0

  for (const docSnap of snap.docs) {
    const title = docSnap.data().title
    process.stdout.write(`  처리 중: ${title.slice(0, 40)}... `)
    const result = await processDoc(client, db, docSnap)
    if (result === 'done')    { done++;    console.log('완료') }
    if (result === 'skipped') { skipped++; console.log('스킵 (rawText 없음)') }
    if (result === 'failed')  { failed++;  /* 이미 에러 출력됨 */ }

    // API 레이트 리밋 방지 (0.5초 간격)
    await new Promise(r => setTimeout(r, 500))
  }

  const endedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
  console.log(`\n[${endedAt}] LLM 처리 완료 — 완료 ${done}건 / 스킵 ${skipped}건 / 실패 ${failed}건\n`)
}

main().catch(e => { console.error(e); process.exit(1) })
