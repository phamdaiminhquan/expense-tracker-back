import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock, SignIn, Sparkle, UserPlus } from '@phosphor-icons/react'
import { AuthSession, login, register } from '@/lib/auth'
import { toast } from 'sonner'

interface LoginFormProps {
  onLogin: (session: AuthSession) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isRegister = mode === 'register'

  const isDisabled = useMemo(() => {
    if (!email.trim() || !password.trim()) return true
    if (isRegister && !name.trim()) return true
    return isLoading
  }, [email, password, isRegister, name, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const payload = { email: email.trim(), password: password.trim(), name: name.trim() }
      const session = isRegister
        ? await register(payload)
        : await login({ email: payload.email, password: payload.password })

      toast.success(isRegister ? 'Đăng ký thành công!' : 'Đăng nhập thành công!', {
        description: `Chào mừng ${session.user.name}`,
      })

      onLogin(session)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra'
      toast.error(isRegister ? 'Đăng ký thất bại' : 'Đăng nhập thất bại', {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchMode = (value: 'login' | 'register') => {
    setMode(value)
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkle weight="fill" className="text-primary" size={48} />
          </div>
          <h1 className="text-3xl font-bold">Chi Tiêu Thông Minh</h1>
          <p className="text-muted-foreground">
            Đăng nhập hoặc đăng ký để bắt đầu
          </p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tài khoản</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={(value) => handleSwitchMode(value as 'login' | 'register')}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login" className="gap-2">
                  <Lock size={16} />
                  Đăng nhập
                </TabsTrigger>
                <TabsTrigger value="register" className="gap-2">
                  <UserPlus size={16} />
                  Đăng ký
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="text-base"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mật khẩu</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="text-base"
                      autoComplete="current-password"
                    />
                  </div>

                  <Button type="submit" disabled={isDisabled} className="w-full gap-2">
                    <SignIn />
                    {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Họ tên</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Nguyen Van A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="text-base"
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="text-base"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Mật khẩu</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="strongpassword"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="text-base"
                      autoComplete="new-password"
                    />
                  </div>

                  <Button type="submit" disabled={isDisabled} className="w-full gap-2">
                    <UserPlus />
                    {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
