# fine:D 프로젝트 가이드

## 프로젝트 개요
- **서비스명:** fine:D
- **설명:** 문화예술 공모·지원사업 정보 플랫폼
- **레포:** https://github.com/finecompany98-design/fine-builder-lecture
- **배포:** GitHub Pages (main 브랜치 push → GitHub Actions 자동 배포)

## 기술 스택
- **프론트엔드:** React 18 + Vite
- **라우팅:** react-router-dom v6
- **상태관리:** Zustand
- **백엔드/DB:** Firebase (Firestore)
- **아이콘:** lucide-react

## 프로젝트 구조
```
src/
├── App.jsx
├── main.jsx
├── components/
│   └── common/
│       ├── Header.jsx
│       └── Header.css
├── pages/
│   ├── Home/          # 메인 홈
│   ├── Competitions/  # 공모 목록·상세
│   ├── Auth/          # 로그인·회원가입
│   ├── MyPage/        # 마이페이지
│   ├── Admin/         # 관리자
│   └── AIRecommend/   # AI 추천
├── services/
│   ├── firebase.js           # Firebase 초기화
│   └── competitions.service.js  # 공모 데이터 CRUD
├── hooks/
├── data/
└── styles/
    └── globals.css    # 전역 스타일, CSS 변수
```

## 디자인 규칙
- **컬러:** `#3747FF` (accent), `#0D0D0D` (텍스트), `#FAFAF9` (배경)
- **폰트:** Noto Sans KR
- **컨테이너:** `max-width: 1200px; width: 90%; margin: 0 auto`
- **반응형 브레이크포인트:** 768px(태블릿), 480px(모바일)
- 고정 px 너비 사용 금지 → `rem`, `%`, `clamp()` 사용
- Flexbox/Grid로 레이아웃 구성

## 워크플로우
- 작업 완료 후 **git commit + push까지 자동 진행**
- 커밋 메시지 형식: `feat:`, `fix:`, `design:`, `refactor:` 등 prefix 사용

## 크롤러 (scripts/scrape.js)
- **환경:** Node.js 20, GitHub Actions, ubuntu-latest
- **라이브러리:** axios(HTTP), cheerio(HTML 파싱), firebase-admin(Firestore 저장)
- **스케줄:** 매주 월요일 09:00 KST → **매일 06:00으로 변경 예정**
- **저장 컬렉션:** Firestore `competitions`
- **수집 소스 (현재 6개):** ARKO, 서울문화재단, 경기문화재단, KOCCA, KOFIC, 대산문화재단

## Firestore 스키마 (competitions 컬렉션)
```
기존: title, organization, orgUrl, category, type, fields, targetGroup,
      amount, region, deadline(Timestamp), description, isActive, source, createdAt

추가 예정:
  startDate      # 신청 시작일 (Timestamp)
  rawText        # 공고 원문 전체 텍스트 (string)
  attachments    # 첨부파일 [{name, url}]
  eligibility    # 자격요건 {age, region, career, entityType, hasBusiness, other}
  tags           # 토픽 배열 (60개 토픽 체계에서 선택)
  supportType    # 지원형태 배열
  documents      # 제출서류 배열
  processedAt    # LLM 후처리 완료 시각 (null이면 미처리)
  updatedAt      # 최종 수정 시각
```

## 개발 로드맵 (Phase)
- **Phase 1 (현재):** 스키마 보강 + 기존 크롤러에 startDate/rawText/updatedAt 추가
- **Phase 2:** 수집 주기 매일로 변경, 중복 체크 강화, 마감 공고 자동 비활성화
- **Phase 3:** LLM 후처리 파이프라인 (rawText → eligibility/tags/supportType/documents)
- **Phase 4:** 소스 확장 (12~15개 목표, 1티어 확인 + 2티어 광역 문화재단 추가)

## LLM 후처리 파이프라인 설계
- **대상:** processedAt == null 인 문서
- **흐름:** rawText → Claude Haiku / GPT-4o-mini → JSON 추출 → Firestore 업데이트
- **권장 모델:** Claude Haiku (공고 1건 $0.01 이하)

## 런칭 목표
- **일정:** 2026-06-30
- **AI 매칭:** 규칙 기반 + LLM 보조, 적합도 라벨 노출 (강력 추천/추천/관심/조건 확인 필요/조건 미달)
- **배포:** Cloudflare Pages (GitHub Actions 자동)

## 최근 작업 이력
- 공모 페이지 에디토리얼 리디자인
- Firestore 오류 메시지 화면 표시 기능
- 공모 데이터 미표시 문제 수정
- 마스코트 제거
