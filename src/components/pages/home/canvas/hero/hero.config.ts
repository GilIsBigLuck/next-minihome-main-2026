/**
 * Hero 씬 텍스트 색상 팔레트
 * TextLayer에서 각 텍스트 인스턴스에 순환 적용됨 (index % length)
 */
export const HERO_TEXT_COLORS = [
  '#000000',
  '#2F7B9C',
  '#363939',
  '#A61E1A',
  '#F2C300',
  '#1E5FA8',
  '#C4161C',
  '#1E6FB8',
] as const

/** TextLayer에서 렌더링할 텍스트 인스턴스 수 (겹쳐서 깊이감 연출) */
export const TEXT_COUNT = 150

/** @react-three/drei <Text>에 적용되는 폰트 경로 (public 폴더 기준) */
export const TEXT_FONT = '/fonts/Rubik-Black.ttf'

/**
 * R3F <Canvas>의 PerspectiveCamera 초기 설정
 * - position: 카메라의 3D 좌표 [x, y, z]. z=5이므로 원점에서 5만큼 뒤에 위치
 * - fov: Field of View(시야각). 값이 작을수록 좁은 화각(확대 효과)
 *   → ResponsiveCamera에서 뷰포트별 FOV를 동적으로 재설정함
 */
export const HOME_CANVAS_CAMERA = {
  position: [0, 0, 5] as [number, number, number],
  fov: 5,
} as const

/**
 * @react-three/drei <ScrollControls> 설정
 * - damping: 스크롤 관성 감쇠값 (0~1, 낮을수록 부드러움)
 * - pages: 가상 스크롤 페이지 수 (실제 DOM 높이 = viewport * pages)
 * - distance: 한 페이지 스크롤 시 이동 거리 비율
 */
export const HOME_CANVAS_SCROLL = {
  damping: 0.2,
  pages: 15,
  distance: 0.5,
} as const

/**
 * FilterLayer의 MeshTransmissionMaterial(유리/투과 재질) 속성
 * - ior: 굴절률 (Index of Refraction). 유리=1.5, 물=1.33
 * - thickness: 투과 재질의 두께 (빛이 통과하는 거리)
 * - anisotropy: 이방성 (빛 반사의 방향성)
 * - chromaticAberration: 색수차 (프리즘 효과, 값이 클수록 무지개 산란 강함)
 * - transmission: 투과율 (0=불투명, 1=완전 투명)
 * - roughness: 표면 거칠기 (0=거울, 1=완전 매트)
 * - metalness: 금속성 (0=비금속, 1=완전 금속)
 */
export const FILTER_MATERIAL = {
  ior: 1.2,
  thickness: 1.5,
  anisotropy: 0.1,
  chromaticAberration: 0.04,
  transmission: 0.9,
  roughness: 0.15,
  metalness: 0.3,
} as const
