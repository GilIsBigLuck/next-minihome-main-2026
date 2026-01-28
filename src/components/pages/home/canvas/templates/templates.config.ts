/** 템플릿 데이터 (id + 이미지 경로) */
export const TEMPLATES = [
  { id: 1, image: '/images/img1.jpg' },
  { id: 2, image: '/images/img2.jpg' },
  { id: 3, image: '/images/img3.jpg' },
  { id: 4, image: '/images/img4.jpg' },
  { id: 5, image: '/images/img5.jpg' },
  { id: 6, image: '/images/img6.jpg' },
  { id: 7, image: '/images/img7.jpg' },
  { id: 8, image: '/images/img8.jpg' },
] as const

/**
 * 템플릿 섹션의 스크롤 구간 (useScroll().offset 기준, 0~1)
 * - startOffset: 템플릿 섹션 진입 시점
 * - endOffset: 템플릿 섹션 퇴장 시점 (이후 비가시)
 */
export const TEMPLATES_SCROLL = {
  startOffset: 0.65,
  endOffset: 0.85,
} as const

/**
 * 템플릿 슬라이드 레이아웃 설정 (Three.js world 단위)
 * - imageScale: [width, height] 4:3 비율
 * - gap: 이미지 간 간격
 * - speed: 슬라이드 이동 속도
 */
export const TEMPLATES_SLIDE = {
  imageScale: [0.3, 0.225] as [number, number],
  gap: 0.2,
  speed: 0.7,
} as const
