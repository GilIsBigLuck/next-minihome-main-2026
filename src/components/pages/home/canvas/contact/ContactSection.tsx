'use client'

/**
 * ContactSection - 컨택트 폼 섹션
 *
 * Three.js / R3F / drei 핵심:
 *   - <Text>: drei의 SDF 텍스트 (troika-three-text 기반). 3D 공간에 고품질 텍스트 렌더링
 *   - <Html>: 3D 씬 안에 실제 DOM 요소를 삽입하는 drei 컴포넌트
 *     - center: 3D 위치 기준 중앙 정렬
 *     - transform: CSS transform 대신 Three.js Object3D.matrix로 위치/크기 제어
 *     - scale: Html 컨테이너의 3D 스케일 (world 단위 → CSS 픽셀 변환 비율)
 *     - prepend: DOM 요소를 Canvas 뒤가 아닌 앞에 배치 (z-index 관련)
 *   - useScroll(): 스크롤 진행도로 텍스트/폼의 등장 타이밍 제어
 *   - material.opacity + material.transparent: 텍스트 페이드 인 효과
 */

import { memo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, Text, useScroll } from '@react-three/drei'
import * as THREE from 'three'

import { CONTACT_SCROLL, CONTACT_TEXT } from './contact.config'

/**
 * useResponsiveHtmlScale - FOV 변화에 따른 Html 스케일 보정 훅
 *
 * 문제: ResponsiveCamera가 뷰포트별로 FOV를 변경하면,
 *   동일한 scale 값의 Html이 서로 다른 크기로 보임.
 *   (FOV가 클수록 더 넓은 영역을 보므로 상대적으로 작아짐)
 *
 * 해결: FOV가 큰 뷰포트에서 scale을 크게 설정하여 시각적 크기 유지
 *   - 모바일 (FOV 10): scale 0.04
 *   - 태블릿 (FOV 10): scale 0.04
 *   - 노트북 (FOV 7):  scale 0.028
 *   - 데스크톱 (FOV 5): scale 0.02
 */
function useResponsiveHtmlScale() {
  const { size } = useThree()
  if (size.width < 640) return 0.04
  if (size.width < 1024) return 0.04
  if (size.width < 1200) return 0.028
  return 0.02
}

const ContactForm = memo(function ContactForm({ opacity }: { opacity: number }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.type || !formData.message) {
      setSubmitStatus({
        type: 'error',
        message: '모든 필드를 입력해주세요.',
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '전송에 실패했습니다.')
      }

      setSubmitStatus({
        type: 'success',
        message: '문의가 성공적으로 전송되었습니다!',
      })

      setFormData({
        name: '',
        email: '',
        type: '',
        message: '',
      })
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : '전송에 실패했습니다.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="w-[calc(100vw-40px)] max-w-[480px] bg-white shadow-2xl p-6 md:p-8"
      style={{
        opacity,
        transition: 'opacity 0.3s ease',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none'
      }}
    >
      <div className="text-center mb-8">
        <span className="material-symbols-outlined text-3xl mb-3 text-gray-800">
          mail
        </span>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Start Your Project</h2>
        <p className="text-gray-500 text-sm font-light">
          당신의 아이디어를 들려주세요.
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              className="peer w-full border-0 border-b border-gray-300 bg-transparent py-2 text-gray-900 focus:border-black focus:ring-0 placeholder-transparent transition-colors text-sm"
              id="name"
              name="name"
              placeholder="Name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label
              className="absolute left-0 -top-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-black"
              htmlFor="name"
            >
              Name
            </label>
          </div>
          <div className="relative">
            <input
              className="peer w-full border-0 border-b border-gray-300 bg-transparent py-2 text-gray-900 focus:border-black focus:ring-0 placeholder-transparent transition-colors text-sm"
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label
              className="absolute left-0 -top-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-black"
              htmlFor="email"
            >
              Email
            </label>
          </div>
        </div>
        <div className="relative">
          <select
            className="peer w-full border-0 border-b border-gray-300 bg-transparent py-2 text-gray-900 focus:border-black focus:ring-0 transition-colors appearance-none text-sm"
            id="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option disabled value="">
              서비스 선택
            </option>
            <option value="template">디자인 템플릿 구매</option>
            <option value="custom">맞춤형 웹사이트 제작</option>
            <option value="other">기타 문의</option>
          </select>
          <label
            className="absolute left-0 -top-3 text-xs text-gray-500"
            htmlFor="type"
          >
            Inquiry Type
          </label>
        </div>
        <div className="relative">
          <textarea
            className="peer w-full border-0 border-b border-gray-300 bg-transparent py-2 text-gray-900 focus:border-black focus:ring-0 placeholder-transparent transition-colors resize-none text-sm"
            id="message"
            placeholder="Message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <label
            className="absolute left-0 -top-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-black"
            htmlFor="message"
          >
            Message
          </label>
        </div>
        {submitStatus.type && (
          <div
            className={`text-center py-2 px-3 rounded-lg text-sm ${
              submitStatus.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {submitStatus.message}
          </div>
        )}
        <div className="text-center pt-4">
          <button
            className="group relative px-10 py-3 bg-black text-white rounded-full overflow-hidden transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            <span className="relative font-medium tracking-widest text-xs flex items-center gap-2">
              {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
              {!isSubmitting && (
                <span className="material-symbols-outlined text-xs">send</span>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  )
})

/**
 * ContactSection - 컨택트 텍스트 + 폼 컨테이너
 *
 * 스크롤 구간별 동작:
 *   - 0.86~: "CONTACT" 텍스트 페이드 인
 *   - 0.95~1.0: 컨택트 폼 페이드 인 (Html 컴포넌트)
 */
export function ContactSection() {
  const groupRef = useRef<THREE.Group>(null)
  const textRef = useRef<THREE.Mesh>(null)
  const scroll = useScroll()
  const [textVisible, setTextVisible] = useState(false)
  const [formOpacity, setFormOpacity] = useState(0)
  /** FOV 보정된 Html scale */
  const htmlScale = useResponsiveHtmlScale()

  useFrame(() => {
    if (!groupRef.current) return

    const scrollOffset = scroll.offset

    // 텍스트 진행도: CONTACT_SCROLL.startOffset(0.86) ~ fullOffset(1.0)
    const isInRange = scrollOffset >= CONTACT_SCROLL.startOffset
    const textProgress = Math.max(
      0,
      Math.min(1, (scrollOffset - CONTACT_SCROLL.startOffset) / (CONTACT_SCROLL.fullOffset - CONTACT_SCROLL.startOffset))
    )
    const shouldShowText = isInRange && textProgress > 0.1

    // 폼 진행도: formStartOffset(0.95) ~ fullOffset(1.0)
    const formProgress = Math.max(
      0,
      Math.min(1, (scrollOffset - CONTACT_SCROLL.formStartOffset) / (CONTACT_SCROLL.fullOffset - CONTACT_SCROLL.formStartOffset))
    )

    if (shouldShowText !== textVisible) {
      setTextVisible(shouldShowText)
    }

    if (formProgress !== formOpacity) {
      setFormOpacity(formProgress)
    }

    // group.visible: 구간 밖에서는 렌더링 제외 (성능 최적화)
    groupRef.current.visible = shouldShowText

    // material.opacity로 텍스트 페이드 인 (transparent=true 필수)
    if (textRef.current && textRef.current.material) {
      const material = textRef.current.material as THREE.MeshBasicMaterial
      material.opacity = textProgress
      material.transparent = true
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0.5]}>
      {/*
        drei <Text>: troika-three-text 기반 SDF 텍스트 렌더링
        - letterSpacing: 자간 (em 단위, 0.1 = 10%)
        - anchorX/Y: "center" = 중앙 기준점
        - z=-0.1: 폼보다 약간 뒤에 배치
      */}
      <Text
        ref={textRef}
        position={[0, 0, -0.1]}
        fontSize={CONTACT_TEXT.fontSize}
        color={CONTACT_TEXT.color}
        font="/fonts/Rubik-Black.ttf"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        CONTACT
      </Text>

      {/*
        drei <Html>: 3D 씬 안에 DOM 삽입
        - center: 3D 좌표 기준 중앙 정렬
        - transform: Three.js의 Object3D matrix로 위치/크기 제어
        - scale: 3D world 단위 → CSS 픽셀 변환 비율 (FOV에 따라 보정)
        - prepend: Canvas DOM 앞에 배치하여 인터랙션 가능
        - formOpacity > 0 조건부 렌더링: 불필요한 DOM 삽입 방지
      */}
      {formOpacity > 0 && (
        <Html
          center
          transform
          scale={htmlScale}
          prepend
        >
          <ContactForm opacity={formOpacity} />
        </Html>
      )}
    </group>
  )
}
