import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthSession, login, register } from '@/lib/auth'
import { toast } from 'sonner'
import capNoelImage from '@/assets/image/Cap-noel.png'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Eye, EyeSlash, CircleNotch, Lock, User, Envelope, Check, EyeSlashIcon, EyeIcon } from '@phosphor-icons/react'
import React from 'react'
import { TextFieldElement } from './components/elements/text-field/text-field.element'

// Types
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

// Segmented Control Component
function SegmentedControl({
  value,
  onChange,
}: {
  value: AuthMode
  onChange: (value: AuthMode) => void
}) {
  return (
    <div className="relative inline-flex bg-gray-100 rounded-full p-1 shadow-inner">
      <div
        className={`absolute top-1 left-1 h-[calc(100%-8px)] w-1/2 rounded-full bg-blue-600 shadow-sm
        transition-transform duration-300 ease-out
        ${value === 'signup' ? 'translate-x-full' : 'translate-x-0'}`}
      />
      <button
        type="button"
        onClick={() => onChange('login')}
        className={`relative z-10 px-6 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer
        ${value === 'login' ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
      >
        Đăng nhập
      </button>
      <button
        type="button"
        onClick={() => onChange('signup')}
        className={`relative z-10 px-6 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer
        ${value === 'signup' ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
      >
        Đăng ký
      </button>
    </div>
  )
}


// Input Field Component with icon
function FormInputField({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled,
  autoComplete,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
  icon,
  validationMessage,
  isValid,
  noIcon = false,
}: {
  id: string
  type?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  autoComplete?: string
  showPasswordToggle?: boolean
  onTogglePassword?: () => void
  showPassword?: boolean
  icon?: React.ReactNode
  validationMessage?: string
  isValid?: boolean
  noIcon?: boolean
}) {
  const inputType = type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type

  const hasIcon = icon && !noIcon

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`h-[56px] rounded-xl border-gray-200 bg-white text-sm placeholder:text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 ${hasIcon ? 'pl-[60px]' : 'pl-4'
            } ${showPasswordToggle ? 'pr-20' : isValid ? 'pr-12' : 'pr-4'} ${error ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20' : ''
            } ${isValid ? 'border-green-300 focus-visible:border-green-500' : ''}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors z-10"
            tabIndex={-1}
          >
            {showPassword ? <VisibilityIcon className='cursor-pointer' /> : <VisibilityOffIcon className='cursor-pointer' />}
          </button>
        )}
        {isValid && !showPasswordToggle && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none z-10">
            <Check size={20} weight="bold" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1.5 px-1">{error}</p>
      )}
      {validationMessage && !error && (
        <p className={`text-xs mt-1.5 px-1 flex items-center gap-1 ${isValid ? 'text-green-600' : 'text-red-500'
          }`}>
          {validationMessage}
        </p>
      )}
    </div>
  )
}

// Password Strength Indicator
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null

  const strength = useMemo(() => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++
    return Math.min(score, 4)
  }, [password])

  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const isWeak = strength <= 1

  if (strength === 0) return null

  return (
    <p className={`text-xs mt-1.5 px-1 flex items-center gap-1 ${isWeak ? 'text-red-500' : 'text-green-600'
      }`}>
      {isWeak ? `${labels[strength - 1]} password` : `${labels[strength - 1]} password`}
      {!isWeak && <Check size={14} weight="bold" />}
    </p>
  )
}

// Main Component
export function LoginForm({ onLogin }: LoginFormProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Validation
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (mode === 'signup' && !name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (mode === 'signup') {
      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = useMemo(() => {
    if (mode === 'login') {
      return email.trim() && password.trim() && validateEmail(email)
    }
    return name.trim() && email.trim() && password.trim() && confirmPassword.trim() &&
      validateEmail(email) && password.length >= 8 && password === confirmPassword
  }, [mode, name, email, password, confirmPassword])

  const passwordStrength = useMemo(() => {
    if (!password) return { strength: 0, isWeak: false }
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++
    return { strength: Math.min(score, 4), isWeak: score <= 1 }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)

      const session = mode === 'signup'
        ? await register({
          email: email.trim(),
          name: name.trim(),
          password: password.trim(),
        })
        : await login({
          email: email.trim(),
          password: password.trim(),
        })

      toast.success(mode === 'signup' ? 'Account created successfully!' : 'Welcome back!', {
        description: `Hello, ${session.user.name}`,
      })

      onLogin(session)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong'
      toast.error(mode === 'signup' ? 'Sign up failed' : 'Log in failed', {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode)
    setErrors({})
    setPassword('')
    setConfirmPassword('')
  }

  const confirmPasswordValid = mode === 'signup' && confirmPassword && password === confirmPassword && !errors.confirmPassword

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 safe-area-inset ">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <img
              src={capNoelImage}
              alt="Finance Capybara"
              className="w-20 h-20 object-contain"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'FinCap' : 'FinCap'}
            </h1>
            <p className="text-sm text-gray-600">
              {mode === 'login'
                ? 'Quản lý tài chính thông minh'
                : 'Bắt đầu quản lý tài chính của bạn'}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4">
          {/* Segmented Control */}
          <div className="flex justify-center">
            <SegmentedControl value={mode} onChange={handleModeChange} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Sign up: Full name */}
            {mode === 'signup' && (
              <FormInputField
                id="name"
                placeholder="Họ và tên"
                value={name}
                onChange={setName}
                error={errors.name}
                disabled={isLoading}
                autoComplete="name"
                noIcon
              />
            )}

            {/* Email */}
            <FormInputField
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              disabled={isLoading}
              autoComplete={mode === 'login' ? 'email' : 'email'}
              noIcon
            />

            {/* Password */}
            <div className="space-y-2">
              <FormInputField
                id="password"
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={setPassword}
                error={errors.password}
                disabled={isLoading}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                showPasswordToggle
                onTogglePassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
                noIcon
                validationMessage={mode === 'signup' && password && passwordStrength.strength > 0 && passwordStrength.isWeak ? 'Weak password ✓' : undefined}
              />
              {mode === 'signup' && password && passwordStrength.strength > 0 && !passwordStrength.isWeak && (
                <PasswordStrength password={password} />
              )}
            </div>

            {/* Sign up: Confirm password */}
            {mode === 'signup' && (
              <FormInputField
                id="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={errors.confirmPassword}
                disabled={isLoading}
                autoComplete="new-password"
                showPasswordToggle
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                showPassword={showConfirmPassword}
                noIcon
                isValid={confirmPasswordValid || undefined}
              />
            )}

            {/* Forgot password (Login only) */}
            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Quên mật khẩu rồi ?
                </button>
              </div>
            )}

            {/* Primary CTA Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <CircleNotch size={20} weight="bold" className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : mode === 'login' ? (
                'Đăng nhập'
              ) : (
                'Đăng ký'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* Social Sign In */}
          <div className="space-y-2">
            {/* Sign in with Apple */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.93-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </Button>

            {/* Sign in with Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Privacy Note (Sign up only) */}
          {mode === 'signup' && (
            <p className="text-xs text-center text-gray-500 leading-relaxed px-4">
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms & Privacy Policy
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
