/**
 * 컨택트 섹션의 스크롤 구간 (useScroll().offset 기준, 0~1)
 * - startOffset: "CONTACT" 텍스트 페이드 인 시작
 * - formStartOffset: 컨택트 폼 페이드 인 시작
 * - fullOffset: 완전 표시 (스크롤 끝)
 */
export const CONTACT_SCROLL = {
  startOffset: 0.86,
  formStartOffset: 0.95,
  fullOffset: 1.0,
} as const

/**
 * 컨택트 텍스트 스타일 (drei <Text> 컴포넌트에 적용)
 * - fontSize: Three.js world 단위 크기
 * - color: 텍스트 색상
 */
export const CONTACT_TEXT = {
  fontSize: 0.15,
  color: '#000000',
} as const
