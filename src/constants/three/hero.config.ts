// 명화톤
export const HERO_COLORS = [
  '#000000',
  '#2F7B9C', // 깊은 수영장 블루
  '#363939', // 그림자/어두운 포인트
  '#A61E1A', // 강렬한 레드 배경
  '#F2C300', // 옐로 포인트
  '#1E5FA8', // 블루 텍스트/도형
  '#C4161C', // 시그니처 레드
  '#1E6FB8', // 블루 포인트
] as const


// 다크톤
// export const HERO_COLORS = [
//   '#1A1A1A', // 90
//   '#333333', // 80
//   '#4D4D4D', // 70
//   '#666666', // 60
//   '#808080', // 50
//   '#999999', // 40
//   '#B3B3B3', // 30
//   '#CCCCCC', // 20
//   '#E6E6E6', // 10
// ] as const



export const TEXT_COUNT = 150

export const TEXT_FONT = '/fonts/Rubik-Black.ttf'

export const HERO_CAMERA = {
  position: [0, 0, 5] as [number, number, number],
  fov: 5,
} as const

export const HERO_SCROLL = {
  damping: 0.2,
  pages: 5,
  distance: 0.5,
} as const

export const FILTER_MATERIAL = {
  ior: 1.2,
  thickness: 1.5,
  anisotropy: 0.1,
  chromaticAberration: 0.04,
  transmission: 0.9,
  roughness: 0.15,
  metalness: 0.3,
} as const

export const HERO_ANIMATION = {
  duration: 2.5, // 펼치기/접기 시간 (초)
  delay: 3, // 대기 시간 (초)
} as const
