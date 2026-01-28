/** 프로젝트 데이터 (id + 이미지 경로) */
export const PROJECTS = [
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
 * 프로젝트 섹션의 스크롤 구간 (useScroll().offset 기준, 0~1)
 * - startOffset: 프로젝트 섹션 진입 시점
 * - fullOffset: 완전 전개 시점
 * - rotateEndOffset: 회전 애니메이션 종료
 * - expandEndOffset: 가로 슬라이드 종료 (이 시점 이후 비가시)
 */
export const PROJECTS_SCROLL = {
  startOffset: 0.35,
  fullOffset: 0.42,
  rotateEndOffset: 0.52,
  expandEndOffset: 0.62,
} as const

/**
 * (레거시) 프로젝트 궤도 회전 설정 - 현재 ProjectsHorizontal로 대체됨
 * - radius: 궤도 반지름 (Three.js world 단위)
 * - speed: 회전 속도
 * - imageScale: [width, height] (Three.js world 단위)
 */
export const PROJECTS_ORBIT = {
  radius: 0.18,
  speed: 0.08,
  imageScale: [0.24, 0.12] as [number, number],
} as const
