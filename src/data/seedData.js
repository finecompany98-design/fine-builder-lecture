import { Timestamp } from 'firebase/firestore'

/**
 * 실제 운영 중인 공모·지원사업 시드 데이터
 * 출처: 각 기관 공식 홈페이지 기준 (모집 시기는 매년 변동 가능 — 반드시 공식 공고 확인)
 *
 * category: 시각예술 | 공연예술 | 문학 | 음악 | 무용 | 영상·미디어 | 공예·디자인 | 전 분야
 * type:     공모전 | 지원사업
 */

function ts(year, month, day) {
  return Timestamp.fromDate(new Date(year, month - 1, day))
}

export const seedItems = [
  // ── 한국문화예술위원회 (ARKO) ──────────────────────────────────
  {
    title: '2026 창작산실 올해의 신작',
    organization: '한국문화예술위원회',
    orgUrl: 'https://www.arko.or.kr',
    category: '공연예술',
    type: '지원사업',
    fields: ['연극', '무용', '음악', '뮤지컬'],
    targetGroup: ['개인', '단체'],
    amount: '최대 5,000만원',
    region: '전국',
    deadline: ts(2026, 4, 30),
    description: '공연예술 분야 창작 역량 있는 예술가·단체를 발굴·육성하는 한국문화예술위원회 대표 지원사업. 연극·무용·음악·뮤지컬 신작 제작 지원.',
    isActive: true,
  },
  {
    title: '예술인 창작지원금 (아르코)',
    organization: '한국문화예술위원회',
    orgUrl: 'https://www.arko.or.kr',
    category: '전 분야',
    type: '지원사업',
    fields: ['시각예술', '공연예술', '문학', '음악', '무용', '영상'],
    targetGroup: ['개인'],
    amount: '최대 500만원',
    region: '전국',
    deadline: ts(2026, 5, 31),
    description: '예술활동증명을 완료한 예술인이라면 분야 제한 없이 신청 가능한 창작 활동비 직접 지원 사업.',
    isActive: true,
  },

  // ── 서울문화재단 ────────────────────────────────────────────────
  {
    title: '서울문화재단 예술창작활동지원 (유망예술지원)',
    organization: '서울문화재단',
    orgUrl: 'https://www.sfac.or.kr',
    category: '전 분야',
    type: '지원사업',
    fields: ['시각예술', '공연예술', '문학', '음악', '무용', '영상'],
    targetGroup: ['개인', '단체'],
    amount: '최대 1,500만원',
    region: '서울',
    deadline: ts(2026, 3, 28),
    description: '서울에서 활동하는 예술가와 단체의 창작 및 발표 활동을 지원. 연간 사업비 일부를 현금 지원.',
    isActive: true,
  },
  {
    title: '서울문화재단 다원예술 창작지원',
    organization: '서울문화재단',
    orgUrl: 'https://www.sfac.or.kr',
    category: '전 분야',
    type: '지원사업',
    fields: ['다원예술', '미디어아트', '융복합'],
    targetGroup: ['개인', '단체'],
    amount: '최대 2,000만원',
    region: '서울',
    deadline: ts(2026, 4, 15),
    description: '장르 경계를 넘나드는 융복합·다원 예술 작업을 지원. 실험적 창작 프로젝트 우선 선정.',
    isActive: true,
  },

  // ── 경기문화재단 ────────────────────────────────────────────────
  {
    title: '경기예술인 창작지원사업',
    organization: '경기문화재단',
    orgUrl: 'https://www.ggcf.kr',
    category: '전 분야',
    type: '지원사업',
    fields: ['시각예술', '공연예술', '문학', '음악', '무용'],
    targetGroup: ['개인', '단체'],
    amount: '최대 1,000만원',
    region: '경기',
    deadline: ts(2026, 4, 30),
    description: '경기도에 거주하거나 활동 근거지를 둔 예술인·단체 대상 창작 프로젝트 지원.',
    isActive: true,
  },

  // ── 한국콘텐츠진흥원 (KOCCA) ────────────────────────────────────
  {
    title: '웹툰창작지원사업',
    organization: '한국콘텐츠진흥원',
    orgUrl: 'https://www.kocca.kr',
    category: '영상·미디어',
    type: '지원사업',
    fields: ['웹툰', '만화'],
    targetGroup: ['개인', '단체'],
    amount: '최대 3,000만원',
    region: '전국',
    deadline: ts(2026, 5, 16),
    description: '신인 및 중견 웹툰 작가의 오리지널 IP 창작을 지원. 제작비·연재 플랫폼 연계 기회 제공.',
    isActive: true,
  },
  {
    title: '실감콘텐츠 창작지원사업',
    organization: '한국콘텐츠진흥원',
    orgUrl: 'https://www.kocca.kr',
    category: '영상·미디어',
    type: '지원사업',
    fields: ['XR', 'VR', 'AR', '미디어아트'],
    targetGroup: ['단체'],
    amount: '최대 1억원',
    region: '전국',
    deadline: ts(2026, 6, 30),
    description: 'VR·AR·XR 기술을 활용한 실감형 문화콘텐츠 창작 프로젝트 제작비 지원.',
    isActive: true,
  },

  // ── 영화진흥위원회 (KOFIC) ──────────────────────────────────────
  {
    title: '독립영화 제작지원 (장·단편)',
    organization: '영화진흥위원회',
    orgUrl: 'https://www.kofic.or.kr',
    category: '영상·미디어',
    type: '지원사업',
    fields: ['독립영화', '단편영화', '장편영화'],
    targetGroup: ['개인', '단체'],
    amount: '장편 최대 1억원 / 단편 최대 3,000만원',
    region: '전국',
    deadline: ts(2026, 5, 31),
    description: '상업 자본에 의존하지 않는 독립영화 창작자를 위한 제작비 직접 지원. 장편·단편·다양성 영화 부문 운영.',
    isActive: true,
  },

  // ── 한국출판문화산업진흥원 ──────────────────────────────────────
  {
    title: '우수출판콘텐츠 제작지원',
    organization: '한국출판문화산업진흥원',
    orgUrl: 'https://www.kpipa.or.kr',
    category: '문학',
    type: '지원사업',
    fields: ['문학', '인문', '사회', '예술'],
    targetGroup: ['단체'],
    amount: '최대 1,000만원',
    region: '전국',
    deadline: ts(2026, 4, 30),
    description: '출판사 대상 우수 도서 기획·제작 지원. 문학·인문·예술 분야 신간 출판 비용 지원.',
    isActive: true,
  },

  // ── 예술경영지원센터 ────────────────────────────────────────────
  {
    title: '공연예술 해외진출 지원',
    organization: '예술경영지원센터',
    orgUrl: 'https://www.gokams.or.kr',
    category: '공연예술',
    type: '지원사업',
    fields: ['연극', '무용', '음악', '뮤지컬'],
    targetGroup: ['개인', '단체'],
    amount: '최대 3,000만원',
    region: '전국',
    deadline: ts(2026, 6, 15),
    description: '해외 공연예술 페스티벌·마켓 참가 및 공연 투어를 지원. 항공·체재비·공연비용 일부 지원.',
    isActive: true,
  },

  // ── 공모전 ──────────────────────────────────────────────────────
  {
    title: '대한민국 미술대전',
    organization: '한국미술협회',
    orgUrl: 'https://www.kfaa.or.kr',
    category: '시각예술',
    type: '공모전',
    fields: ['회화', '조각', '공예', '서예', '사진'],
    targetGroup: ['개인'],
    amount: '대상 1,000만원 / 금상 500만원',
    region: '전국',
    deadline: ts(2026, 7, 31),
    description: '한국미술협회 주관 국내 최대 규모 미술 공모전. 회화·조각·공예·서예·사진 등 전 시각예술 분야.',
    isActive: true,
  },
  {
    title: '전국학생미술실기대회',
    organization: '한국미술협회',
    orgUrl: 'https://www.kfaa.or.kr',
    category: '시각예술',
    type: '공모전',
    fields: ['회화', '드로잉'],
    targetGroup: ['개인'],
    amount: '대상 300만원',
    region: '전국',
    deadline: ts(2026, 8, 31),
    description: '초·중·고등학생 및 대학생 대상 미술 실기 공모전. 입상 시 미술대학 입시 포트폴리오 활용 가능.',
    isActive: true,
  },
  {
    title: '대산창작기금 (문학)',
    organization: '대산문화재단',
    orgUrl: 'https://www.daesan.or.kr',
    category: '문학',
    type: '지원사업',
    fields: ['시', '소설', '희곡', '평론', '번역'],
    targetGroup: ['개인'],
    amount: '최대 1,000만원',
    region: '전국',
    deadline: ts(2026, 5, 31),
    description: '시·소설·희곡·평론·번역 부문 문학인 창작 활동비 지원. 국내 대표 민간 문학 지원 사업.',
    isActive: true,
  },
  {
    title: '한국국제아트페어(KIAF) 신진작가 공모',
    organization: '한국화랑협회',
    orgUrl: 'https://www.kiaf.com',
    category: '시각예술',
    type: '공모전',
    fields: ['회화', '조각', '미디어아트', '설치'],
    targetGroup: ['개인'],
    amount: '부스 지원 + 전시 기회',
    region: '전국',
    deadline: ts(2026, 6, 30),
    description: '아시아 최대 아트페어 KIAF에 참여할 신진 작가 선발 공모. 입선 시 갤러리 연계 및 KIAF 부스 전시 기회 제공.',
    isActive: true,
  },
]
