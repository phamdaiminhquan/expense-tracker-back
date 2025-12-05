import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { SignIn, Sparkle } from '@phosphor-icons/react'
import { authenticateUser, MOCK_USERS } from '@/lib/auth'
import { toast } from 'sonner'

interface LoginFormProps {
  onLogin: (userId: string, userName: string) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error('Vui lòng nhập email')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const user = authenticateUser(email.trim())
      
      if (user) {
        toast.success('Đăng nhập thành công!', {
          description: `Chào mừng ${user.name}`,
        })
        onLogin(user.id, user.name)
      } else {
        toast.error('Email không tồn tại', {
          description: 'Vui lòng kiểm tra lại email',
        })
      }
      
      setIsLoading(false)
    }, 800)
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
            Quản lý chi tiêu với trí tuệ nhân tạo
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 flex just">
                <Label htmlFor="email">Email: </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="text-base"
                />
              </div>
              <Button
                type="submit"
                disabled={!email.trim() || isLoading}
                className="w-full gap-2"
              >
                <SignIn />
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Tài khoản demo:</p>
              <div className="grid gap-2 text-sm">
                {MOCK_USERS.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setEmail(user.email)}
                    className="text-left p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground text-xs">{user.email}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
