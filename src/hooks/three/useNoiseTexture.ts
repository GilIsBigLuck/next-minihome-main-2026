import { useMemo } from 'react'
import * as THREE from 'three'

interface NoiseTextureOptions {
  size?: number
  frequency?: number
}

export function useNoiseTexture(options: NoiseTextureOptions = {}) {
  const { size = 128, frequency = 0.1 } = options

  return useMemo(() => {
    const data = new Uint8Array(size * size * 4)

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const value =
          (Math.sin(x * frequency) * Math.cos(y * frequency) + 1) * 0.5 * 255
        const index = (y * size + x) * 4
        data[index] = value
        data[index + 1] = value
        data[index + 2] = value
        data[index + 3] = 255
      }
    }

    const texture = new THREE.DataTexture(data, size, size)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true

    return texture
  }, [size, frequency])
}
