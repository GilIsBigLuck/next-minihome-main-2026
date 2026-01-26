export const HERO_COLORS = [
  '#000000',
  '#2F7B9C',
  '#363939',
  '#A61E1A',
  '#F2C300',
  '#1E5FA8',
  '#C4161C',
  '#1E6FB8',
] as const

export const TEXT_COUNT = 150

export const TEXT_FONT = '/fonts/Rubik-Black.ttf'

export const HERO_CAMERA = {
  position: [0, 0, 5] as [number, number, number],
  fov: 5,
} as const

export const HERO_SCROLL = {
  damping: 0.2,
  pages: 15,
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
