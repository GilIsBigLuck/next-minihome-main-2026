// 명화톤
// export const HERO_COLORS = [
//   '#000000',
//   '#2F7B9C', // 깊은 수영장 블루
//   '#A37965', // 따뜻한 브라운/건물 포인트
//   '#363939', // 그림자/어두운 포인트
//   '#A61E1A', // 강렬한 레드 배경
//   '#F2C300', // 옐로 포인트
//   '#1F1A17', // 블랙 라인/피규어
//   '#1E5FA8', // 블루 텍스트/도형
//   '#6B8E3D', // 그린 페인트 터치
//   '#C4161C', // 시그니처 레드
//   '#F2C400', // 옐로 포인트 (제목/강조)
//   '#6A1A1A', // 딥 레드/버건디
//   '#6E2FA6', // 퍼플 포인트 (일부 커버)
//   '#1E6FB8', // 블루 포인트 (소수 커버)
// ] as const


// 다크톤
export const HERO_COLORS = [
  '#1A1A1A', // 90
  '#333333', // 80
  '#4D4D4D', // 70
  '#666666', // 60
  '#808080', // 50
  // '#999999', // 40
  // '#B3B3B3', // 30
  // '#CCCCCC', // 20
  // '#E6E6E6', // 10
] as const



export const TEXT_COUNT = 100

export const TEXT_FONT = '/fonts/Rubik-Black.ttf'

export const HERO_CAMERA = {
  position: [0, 0, 5] as [number, number, number],
  fov: 5,
} as const

export const HERO_SCROLL = {
  damping: 0.2,
  pages: 3,
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
