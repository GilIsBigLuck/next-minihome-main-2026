import { useMemo } from 'react'
import * as THREE from 'three'

interface NoiseTextureOptions {
  size?: number       // 텍스처 해상도 (size x size 픽셀)
  frequency?: number  // 노이즈 주파수 (높을수록 촘촘한 패턴)
}

/**
 * useNoiseTexture - 절차적(procedural) 노이즈 텍스처 생성 훅
 *
 * sin/cos 기반의 간단한 노이즈 패턴을 생성하여 THREE.DataTexture로 반환.
 * FilterLayer의 MeshTransmissionMaterial.roughnessMap에 사용되어
 * 표면의 불규칙한 거칠기를 표현함.
 *
 * Three.js 핵심 개념:
 *   - DataTexture: CPU에서 생성한 픽셀 데이터(Uint8Array)를 GPU 텍스처로 변환
 *     - 4채널 (RGBA): 각 픽셀당 4바이트 [R, G, B, A]
 *     - needsUpdate = true: 데이터 변경 후 GPU에 업로드 필요 신호
 *   - wrapS / wrapT: 텍스처 래핑 모드
 *     - RepeatWrapping: UV가 0~1 범위를 넘으면 반복 (타일링)
 *   - minFilter / magFilter: 텍스처 필터링
 *     - LinearFilter: 선형 보간 (부드러운 확대/축소)
 *
 * useMemo로 래핑: size/frequency가 변하지 않으면 텍스처를 재생성하지 않음
 */
export function useNoiseTexture(options: NoiseTextureOptions = {}) {
  const { size = 128, frequency = 0.1 } = options

  return useMemo(() => {
    // RGBA 4채널, size x size 해상도
    const data = new Uint8Array(size * size * 4)

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // sin * cos 조합으로 2D 노이즈 패턴 생성 (0~255)
        const value =
          (Math.sin(x * frequency) * Math.cos(y * frequency) + 1) * 0.5 * 255
        const index = (y * size + x) * 4
        data[index] = value       // R
        data[index + 1] = value   // G
        data[index + 2] = value   // B
        data[index + 3] = 255     // A (완전 불투명)
      }
    }

    const texture = new THREE.DataTexture(data, size, size)
    texture.wrapS = THREE.RepeatWrapping   // 수평 반복
    texture.wrapT = THREE.RepeatWrapping   // 수직 반복
    texture.minFilter = THREE.LinearFilter // 축소 시 선형 보간
    texture.magFilter = THREE.LinearFilter // 확대 시 선형 보간
    texture.needsUpdate = true             // GPU에 업로드 트리거

    return texture
  }, [size, frequency])
}
