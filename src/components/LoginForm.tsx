import React, { useState, useEffect, useRef, useMemo } from 'react'
import { AuthSession, login, register } from '@/lib/auth'
import { toast } from 'sonner'
import { Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react'
import { Capybara, type CapyMood } from './capybara/CapyFace'
import { LoadingScreen } from './capybara/LoadingScreen'

// ==========================================
// STYLES & ANIMATIONS
// ==========================================
const formStyles = `
  .fly-transition {
    transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .form-fade-in {
    animation: formFadeIn 0.5s ease-out forwards;
  }
  
  @keyframes formFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .input-animate {
    animation: inputSlideIn 0.4s ease-out forwards;
    opacity: 0;
  }
  
  @keyframes inputSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

// ==========================================
// MINIMAL INPUT COMPONENT
// ==========================================
interface MinimalInputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: () => void
  onBlur?: () => void
  delay?: number
  error?: string
  disabled?: boolean
  autoComplete?: string
  rightElement?: React.ReactNode
}

function MinimalInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  delay = 0,
  error,
  disabled,
  autoComplete,
  rightElement
}: MinimalInputProps) {
  return (
    <div
      className="relative mt-6 w-full input-animate"
      style={{ animationDelay: `${delay}s` }}
    >
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`peer w-full border-b-2 bg-transparent py-3 text-lg font-medium text-gray-900 placeholder-transparent focus:outline-none transition-colors duration-300 ${
          error 
            ? 'border-red-400 focus:border-red-500' 
            : 'border-gray-200 focus:border-black'
        } ${rightElement ? 'pr-12' : ''} ${disabled ? 'opacity-50' : ''}`}
        placeholder={label}
        style={
          type === 'password' 
            ? { 
                // Đảm bảo password hiển thị dấu * trên iOS
                WebkitTextSecurity: 'disc',
                textSecurity: 'disc'
              } 
            : undefined
        }
      />
      <label
        htmlFor={id}
        className={`absolute left-0 transition-all pointer-events-none ${
          value
            ? '-top-3 text-sm text-gray-600'
            : 'top-3 text-base text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600'
        }`}
      >
        {label}
      </label>
      {rightElement && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-1 animate-pulse">{error}</p>
      )}
    </div>
  )
}

// ==========================================
// PRIMARY BUTTON COMPONENT
// ==========================================
interface PrimaryButtonProps {
  text: string
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  type?: 'button' | 'submit'
}

function PrimaryButton({
  text,
  onClick,
  loading,
  disabled,
  onMouseEnter,
  onMouseLeave,
  type = 'button'
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled || loading}
      className={`group relative mt-8 w-full overflow-hidden rounded-full py-4 text-white shadow-xl transition-all duration-300 ${
        disabled || loading
          ? 'bg-gray-300 cursor-not-allowed shadow-gray-200'
          : 'bg-black hover:bg-gray-900 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98]'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            <span className="text-base font-semibold tracking-wide">{text}</span>
            <ArrowRight 
              size={18} 
              className="transition-transform duration-300 group-hover:translate-x-1" 
            />
          </>
        )}
      </div>
    </button>
  )
}

// ==========================================
// TYPES
// ==========================================
type AuthMode = 'login' | 'signup'

interface LoginFormProps {
  onLogin: (session: AuthSession) => void
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

// ==========================================
// MAIN LOGIN FORM
// ==========================================
export function LoginForm({ onLogin }: LoginFormProps) {
  // Loading State
  const [isLoading, setIsLoading] = useState(true)
  const [isAppReady, setIsAppReady] = useState(false)

  // Intro & Flying Animation
  const [introMode, setIntroMode] = useState(true)
  const [isFlying, setIsFlying] = useState(false)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  // Capybara States
  const [capyMood, setCapyMood] = useState<CapyMood>('sleepy')
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })

  // Form States
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Focus state for Capybara mood
  const [focusedField, setFocusedField] = useState<string | null>(null)
  
  // Mouse/Touch tracking state
  const [isMouseInView, setIsMouseInView] = useState(false)
  const lastInteractionRef = useRef<number>(Date.now())

  // Refs
  const targetButtonRef = useRef<HTMLButtonElement>(null)
  const moodTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const capybaraRef = useRef<HTMLDivElement>(null)
  const randomGlanceRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Validation
  const validateEmail = (emailStr: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (mode === 'signup' && !name.trim()) {
      newErrors.name = 'Tên là bắt buộc'
    }

    if (!email.trim()) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ'
    }

    if (!password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    }

    if (mode === 'signup') {
      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu không khớp'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = useMemo(() => {
    if (mode === 'login') {
      return email.trim() && password.trim() && validateEmail(email)
    }
    return (
      name.trim() &&
      email.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      validateEmail(email) &&
      password.length >= 8 &&
      password === confirmPassword
    )
  }, [mode, name, email, password, confirmPassword])

  const confirmPasswordValid =
    mode === 'signup' && confirmPassword && password === confirmPassword && !errors.confirmPassword

  // Loading Screen Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => {
        setIsAppReady(true)
      }, 600)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Helper: Calculate eye position relative to Capybara
  // Function này được tạo 1 lần và không thay đổi, không cần memoize
  const calculateEyePosition = (clientX: number, clientY: number) => {
    if (!capybaraRef.current) return { x: 0, y: 0 }
    
    const rect = capybaraRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Calculate direction from Capybara to cursor
    const deltaX = clientX - centerX
    const deltaY = clientY - centerY
    
    // Normalize to max range of 2 (within pupil bounds)
    const maxRange = 2
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const normalizedDistance = Math.min(distance / 200, 1) // 200px = max distance for full movement
    
    const x = (deltaX / (distance || 1)) * maxRange * normalizedDistance
    const y = (deltaY / (distance || 1)) * maxRange * normalizedDistance
    
    return { x, y }
  }

  // Random glance function
  const doRandomGlance = () => {
    const rX = (Math.random() - 0.5) * 3 // -1.5 to 1.5
    const rY = (Math.random() - 0.5) * 2 // -1 to 1
    setEyePosition({ x: rX, y: rY })
  }

  // Mouse tracking for Desktop - Optimized with RAF throttling
  useEffect(() => {
    let rafId: number | null = null
    let lastPos = { x: 0, y: 0 }
    
    const handleMouseMove = (e: MouseEvent) => {
      lastInteractionRef.current = Date.now()
      setIsMouseInView(true)
      
      // Chỉ theo dõi chuột khi không đang focus vào input
      if (!focusedField && !showPassword && !showConfirmPassword) {
        // Throttle với requestAnimationFrame để tránh quá nhiều updates
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            const pos = calculateEyePosition(e.clientX, e.clientY)
            // Chỉ update nếu vị trí thay đổi đáng kể (> 0.1px) để tránh re-render không cần thiết
            const deltaX = Math.abs(pos.x - lastPos.x)
            const deltaY = Math.abs(pos.y - lastPos.y)
            if (deltaX > 0.1 || deltaY > 0.1) {
              lastPos = pos
              setEyePosition(pos)
              setCapyMood('neutral')
            }
            rafId = null
          })
        }
      }
    }

    const handleMouseLeave = () => {
      setIsMouseInView(false)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [focusedField, showPassword, showConfirmPassword])

  // Touch tracking for Mobile - Optimized with RAF throttling
  useEffect(() => {
    let rafId: number | null = null
    let lastPos = { x: 0, y: 0 }
    
    const handleTouchStart = (e: TouchEvent) => {
      // QUAN TRỌNG: Bỏ qua nếu touch vào interactive elements (input, button, link)
      // Để tránh interfere với default behavior của chúng
      const target = e.target as HTMLElement
      if (target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('input') ||
        target.closest('button') ||
        target.closest('a')
      )) {
        return // Không xử lý, để browser xử lý default behavior
      }
      
      lastInteractionRef.current = Date.now()
      setIsMouseInView(true)
      
      if (!focusedField && !showPassword && !showConfirmPassword) {
        const touch = e.touches[0]
        const pos = calculateEyePosition(touch.clientX, touch.clientY)
        lastPos = pos
        setEyePosition(pos)
        setCapyMood('neutral')
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Bỏ qua nếu đang touch vào interactive elements
      const target = e.target as HTMLElement
      if (target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('input') ||
        target.closest('button') ||
        target.closest('a')
      )) {
        return
      }
      
      lastInteractionRef.current = Date.now()
      
      if (!focusedField && !showPassword && !showConfirmPassword) {
        // Throttle với requestAnimationFrame
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            const touch = e.touches[0]
            const pos = calculateEyePosition(touch.clientX, touch.clientY)
            // Chỉ update nếu vị trí thay đổi đáng kể
            const deltaX = Math.abs(pos.x - lastPos.x)
            const deltaY = Math.abs(pos.y - lastPos.y)
            if (deltaX > 0.1 || deltaY > 0.1) {
              lastPos = pos
              setEyePosition(pos)
            }
            rafId = null
          })
        }
      }
    }

    const handleTouchEnd = () => {
      setIsMouseInView(false)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [focusedField, showPassword, showConfirmPassword])

  // Random glancing when idle (no interaction for 2s) - Optimized
  useEffect(() => {
    let lastGlancePos = { x: 0, y: 0 }
    
    const checkIdle = () => {
      const now = Date.now()
      const timeSinceLastInteraction = now - lastInteractionRef.current
      
      // Nếu không có tương tác trong 2s và không focus, liếc ngẫu nhiên
      if (timeSinceLastInteraction > 2000 && !focusedField && !showPassword && !showConfirmPassword) {
        const rX = (Math.random() - 0.5) * 3
        const rY = (Math.random() - 0.5) * 2
        
        // Chỉ update nếu vị trí mới khác đáng kể để tránh re-render không cần thiết
        const deltaX = Math.abs(rX - lastGlancePos.x)
        const deltaY = Math.abs(rY - lastGlancePos.y)
        if (deltaX > 0.2 || deltaY > 0.2) {
          lastGlancePos = { x: rX, y: rY }
          setEyePosition({ x: rX, y: rY })
          setCapyMood('sleepy')
        }
      }
    }

    // Chạy ngay lần đầu sau 2s
    const initialTimeout = setTimeout(() => {
      if (!focusedField) {
        const rX = (Math.random() - 0.5) * 3
        const rY = (Math.random() - 0.5) * 2
        lastGlancePos = { x: rX, y: rY }
        setEyePosition({ x: rX, y: rY })
      }
    }, 2000)

    // Sau đó chạy mỗi 2.5s (đủ lâu để không gây lag)
    randomGlanceRef.current = setInterval(checkIdle, 2500)

    return () => {
      clearTimeout(initialTimeout)
      if (randomGlanceRef.current) {
        clearInterval(randomGlanceRef.current)
      }
    }
  }, [focusedField, showPassword, showConfirmPassword])

  // Eye Tracking Logic based on input length (liếc theo typing)
  const handleInputTrack = (value: string) => {
    lastInteractionRef.current = Date.now()
    const len = value.length
    // Mắt liếc theo chiều dài text (từ trái sang phải)
    const xPos = Math.min(Math.max((len * 0.3) - 1.5, -2), 2)
    setEyePosition({ x: xPos, y: 1 })
  }

  // Capybara mood based on focus
  useEffect(() => {
    if (showPassword || showConfirmPassword) {
      // Khi hiện mật khẩu: liếc đi chỗ khác "ai nhìn gì đâu"
      setCapyMood('shy')
      setEyePosition({ x: -2, y: -1 }) // Nhìn sang trái lên trên
    } else if (focusedField === 'password' || focusedField === 'confirmPassword') {
      // Khi nhập mật khẩu (không hiện): nhìn xuống ngại ngùng
      setCapyMood('shy')
      setEyePosition({ x: 0, y: 2 })
    } else if (focusedField === 'email' || focusedField === 'name') {
      // Khi nhập email/name: theo dõi typing (neutral mood, không scanner)
      setCapyMood('neutral')
    } else if (!focusedField) {
      // Không focus: sleepy
      setCapyMood('sleepy')
    }
  }, [focusedField, showPassword, showConfirmPassword])

  const setMoodWithTimeout = (mood: CapyMood, duration = 0) => {
    if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current)
    setCapyMood(mood)
    if (duration > 0) {
      moodTimeoutRef.current = setTimeout(() => {
        setCapyMood('sleepy')
      }, duration)
    }
  }

  // Submit Handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!validateForm()) {
      setMoodWithTimeout('angry', 1500)
      return
    }

    if (targetButtonRef.current) {
      const rect = targetButtonRef.current.getBoundingClientRect()
      setTargetRect(rect)
    }

    setCapyMood('scanner')
    setEyePosition({ x: 0, y: 0 })
    
    await performAuth()
  }

  const performAuth = async () => {
    try {
      setIsSubmitting(true)

      const session =
        mode === 'signup'
          ? await register({
              email: email.trim(),
              name: name.trim(),
              password: password.trim(),
            })
          : await login({
              email: email.trim(),
              password: password.trim(),
            })

      setCapyMood('simp')
      
      if (introMode && mode === 'login') {
        toast.success('Chào mừng trở lại!', {
          description: `Xin chào, ${session.user.name}`,
        })

        setTimeout(() => {
          setIsFlying(true)
          setTimeout(() => {
            setIntroMode(false)
            setIsFlying(false)
            onLogin(session)
          }, 800)
        }, 500)
      } else {
        toast.success(mode === 'signup' ? 'Tạo tài khoản thành công!' : 'Chào mừng trở lại!', {
          description: `Xin chào, ${session.user.name}`,
        })
        setTimeout(() => {
          onLogin(session)
        }, 800)
      }
    } catch (error) {
      setCapyMood('disappointed')
      const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi'
      toast.error(mode === 'signup' ? 'Đăng ký thất bại' : 'Đăng nhập thất bại', {
        description: message,
      })
      
      setTimeout(() => {
        setCapyMood('sleepy')
      }, 2500)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode)
    setErrors({})
    setPassword('')
    setConfirmPassword('')
    setIsFlying(false)
    setCapyMood('neutral')
    if (newMode === 'login') {
      setIntroMode(true)
    } else {
      setIntroMode(false)
    }
  }

  // Flying styles
  const flyStyle: React.CSSProperties =
    isFlying && targetRect
      ? {
          position: 'fixed',
          top: targetRect.top + 'px',
          left: targetRect.left + 'px',
          width: targetRect.width + 'px',
          height: targetRect.height + 'px',
          transform: 'translate(0, 0) scale(0.35)',
          borderRadius: '1rem',
          zIndex: 100,
        }
      : {}

  // Password toggle button
  const PasswordToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="p-2 text-gray-400 hover:text-black transition-colors"
    >
      {show ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  )

  return (
    <div className="relative w-full min-h-screen bg-[#FAFAFA] text-gray-900 font-sans overflow-hidden selection:bg-black selection:text-white">
      <style>{formStyles}</style>

      <LoadingScreen isLoading={isLoading} />

      {/* INTRO LOGIN FORM */}
      {introMode && mode === 'login' && (
        <div
          className={`fixed inset-0 z-40 bg-[#FAFAFA] flex flex-col px-8 transition-opacity duration-500 ${
            isFlying ? 'pointer-events-none' : ''
          }`}
        >
          <div
            className={`w-full max-w-sm mx-auto flex flex-col min-h-screen py-8 transition-all duration-500 ${
              isFlying ? 'opacity-0 translate-y-10 scale-90' : 'opacity-100'
            }`}
          >
            {/* TOP: Branding & Header */}
            <div className="form-fade-in">
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                Chào bồ tèo,
              </h1>
              <p className="text-gray-400 text-base">
                Ví tiền vẫn an toàn chứ?
              </p>
            </div>

            {/* MIDDLE: Capybara */}
            <div 
              ref={capybaraRef}
              className={`flex justify-center py-6 fly-transition ${isFlying ? 'opacity-0' : 'opacity-100'}`}
              style={isFlying && targetRect ? {
                position: 'fixed',
                top: targetRect.top + 'px',
                left: targetRect.left + 'px',
                width: targetRect.width + 'px',
                height: targetRect.height + 'px',
                transform: 'translate(0, 0) scale(0.35)',
                zIndex: 100,
              } : {}}
            >
              <Capybara
                mood={capyMood}
                eyePos={eyePosition}
                scale={isFlying ? 0.5 : 0.9}
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1">
              <MinimalInput
                id="email-intro"
                label="Email chính chủ"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  handleInputTrack(e.target.value)
                }}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                delay={0.1}
                error={errors.email}
                autoComplete="email"
              />

              <MinimalInput
                id="password-intro"
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                delay={0.2}
                error={errors.password}
                autoComplete="current-password"
                rightElement={
                  <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                }
              />

              <div className="mt-4 flex justify-end input-animate" style={{ animationDelay: '0.3s' }}>
                <a href="#" className="text-sm font-medium text-gray-400 hover:text-black transition-colors">
                  Quên mật khẩu?
                </a>
              </div>

              <div className="input-animate" style={{ animationDelay: '0.4s' }}>
                <PrimaryButton
                  text="Mở két sắt"
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isFormValid}
                  onMouseEnter={() => setCapyMood('simp')}
                  onMouseLeave={() => setCapyMood(focusedField ? 'scanner' : 'sleepy')}
                />
              </div>
            </form>

            {/* BOTTOM: Switch to Signup */}
            <div 
              className="mt-auto pt-6 pb-safe input-animate" 
              style={{ 
                animationDelay: '0.5s',
                paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
              }}
            >
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                className="group flex items-center justify-center gap-2 w-full text-sm font-medium text-gray-500 hover:text-black transition-colors"
              >
                <span>Chưa có tài khoản?</span>
                <span className="px-4 py-2 bg-white border border-gray-200 rounded-full text-black shadow-sm group-hover:shadow-md transition-all">
                  Đăng ký
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NÚT ĐÍCH Ở FOOTER */}
      {mode === 'login' && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-4">
          <div className="max-w-sm mx-auto">
            <button
              ref={targetButtonRef}
              onClick={() => handleSubmit()}
              disabled={!isFormValid || isSubmitting || introMode}
              className={`
                w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-transparent ml-auto
                transition-all duration-500 overflow-hidden
                ${introMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                ${isSubmitting ? 'animate-pulse' : ''}
              `}
            >
              <Capybara
                mood={capyMood}
                eyePos={eyePosition}
                scale={0.4}
              />
            </button>
          </div>
        </div>
      )}

      {/* SIGNUP FORM */}
      {mode === 'signup' && (
        <div
          className={`flex flex-col min-h-screen transition-all duration-500 ${
            isAppReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex-1 flex flex-col px-8 py-8">
            <div className="w-full max-w-sm mx-auto flex flex-col min-h-full">
              {/* TOP: Branding & Header */}
              <div className="form-fade-in">
                <h1 className="text-3xl font-bold tracking-tight mb-1">
                  Kết nạp hội
                </h1>
                <p className="text-gray-400 text-base">
                  Chỉ mất 2 phút, không lừa lọc.
                </p>
              </div>

              {/* Capybara */}
              <div ref={capybaraRef} className="flex justify-center py-4">
                <Capybara
                  mood={capyMood}
                  eyePos={eyePosition}
                  scale={0.7}
                />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1">
                <MinimalInput
                  id="name-signup"
                  label="Tên cúng cơm"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    handleInputTrack(e.target.value)
                  }}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  delay={0.1}
                  error={errors.name}
                  disabled={isSubmitting}
                />

                <MinimalInput
                  id="email-signup"
                  label="Email chính chủ"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    handleInputTrack(e.target.value)
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  delay={0.2}
                  error={errors.email}
                  disabled={isSubmitting}
                  autoComplete="email"
                />

                <MinimalInput
                  id="password-signup"
                  label="Mật khẩu (ít nhất 8 ký tự)"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  delay={0.3}
                  error={errors.password}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  rightElement={
                    <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                  }
                />

                <MinimalInput
                  id="confirm-password-signup"
                  label="Nhập lại mật khẩu"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  delay={0.4}
                  error={errors.confirmPassword}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  rightElement={
                    <div className="flex items-center gap-1">
                      {confirmPasswordValid && <Check size={16} className="text-green-500" />}
                      <PasswordToggle 
                        show={showConfirmPassword} 
                        onToggle={() => setShowConfirmPassword(!showConfirmPassword)} 
                      />
                    </div>
                  }
                />

                <div className="input-animate" style={{ animationDelay: '0.5s' }}>
                  <PrimaryButton
                    text="Gia nhập ngay"
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isFormValid}
                    onMouseEnter={() => setCapyMood('simp')}
                    onMouseLeave={() => setCapyMood(focusedField ? 'scanner' : 'sleepy')}
                  />
                </div>
              </form>

              {/* BOTTOM: Switch to Login - Consistent position */}
              <div 
                className="mt-auto pt-6 input-animate" 
                style={{ 
                  animationDelay: '0.6s',
                  paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
                }}
              >
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="group flex items-center justify-center gap-2 w-full text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                  <span>Đã có tài khoản?</span>
                  <span className="px-4 py-2 bg-white border border-gray-200 rounded-full text-black shadow-sm group-hover:shadow-md transition-all">
                    Đăng nhập
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN FORM SAU KHI HẾT INTRO */}
      {!introMode && mode === 'login' && (
        <div
          className={`flex flex-col min-h-screen transition-all duration-500 ${
            isAppReady ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 4rem))' }}
        >
          <div className="flex-1 flex flex-col px-8 py-8">
            <div className="w-full max-w-sm mx-auto flex flex-col min-h-full">
              {/* TOP: Branding & Header */}
              <div className="form-fade-in">
                <h1 className="text-3xl font-bold tracking-tight mb-1">
                  Chào bồ tèo,
                </h1>
                <p className="text-gray-400 text-base">
                  Ví tiền vẫn an toàn chứ?
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 mt-8">
                <MinimalInput
                  id="email-login"
                  label="Email chính chủ"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    handleInputTrack(e.target.value)
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  delay={0.1}
                  error={errors.email}
                  disabled={isSubmitting}
                  autoComplete="email"
                />

                <MinimalInput
                  id="password-login"
                  label="Mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  delay={0.2}
                  error={errors.password}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  rightElement={
                    <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                  }
                />

                <div className="mt-4 flex justify-end input-animate" style={{ animationDelay: '0.3s' }}>
                  <a href="#" className="text-sm font-medium text-gray-400 hover:text-black transition-colors">
                    Quên mật khẩu?
                  </a>
                </div>

                <div className="input-animate" style={{ animationDelay: '0.4s' }}>
                  <PrimaryButton
                    text="Mở két sắt"
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isFormValid}
                    onMouseEnter={() => setCapyMood('simp')}
                    onMouseLeave={() => setCapyMood(focusedField ? 'scanner' : 'sleepy')}
                  />
                </div>
              </form>

              {/* BOTTOM: Switch to Signup - Consistent position */}
              <div 
                className="mt-auto pt-6 input-animate" 
                style={{ 
                  animationDelay: '0.5s',
                  paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
                }}
              >
                <button
                  type="button"
                  onClick={() => handleModeChange('signup')}
                  className="group flex items-center justify-center gap-2 w-full text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                  <span>Chưa có tài khoản?</span>
                  <span className="px-4 py-2 bg-white border border-gray-200 rounded-full text-black shadow-sm group-hover:shadow-md transition-all">
                    Đăng ký
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
