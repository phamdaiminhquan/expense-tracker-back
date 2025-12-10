import { Fund } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, Wallet, Users, CaretRight, SignOut } from '@phosphor-icons/react'
import { useState } from 'react'

interface FundListScreenProps {
  funds: Fund[]
  currentUserId: string
  currentUserName: string
  onSelectFund: (fundId: string) => void
  onCreateFund: () => void
  isLoading?: boolean
  onRefresh?: () => void
  onLogout: () => void
}

export function FundListScreen({
  funds,
  currentUserId,
  currentUserName,
  onSelectFund,
  onCreateFund,
  isLoading = false,
  onRefresh,
  onLogout,
}: FundListScreenProps) {
  const [fundNameInput, setFundNameInput] = useState('')

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  const handleCreateFund = () => {
    onCreateFund()
    setFundNameInput('')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-md mx-auto px-5 py-6 space-y-6">
        <header className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 bg-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-base">
                  {getInitials(currentUserName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">XIN CHÀO</p>
                <p className="font-semibold text-base text-foreground">{currentUserName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <SignOut size={20} />
            </Button>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight" style={{ color: 'oklch(0.52 0.19 264)' }}>
              Chi Tiêu<br />Thông Minh
            </h1>
            <p className="text-sm text-muted-foreground">
              Chi cần nhập, AI sẽ lo phần còn lại.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Tên quỹ mới..."
              value={fundNameInput}
              onChange={(e) => setFundNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && fundNameInput.trim()) {
                  handleCreateFund()
                }
              }}
              className="flex-1 bg-muted/50 border-muted"
            />
            <Button
              onClick={handleCreateFund}
              size="icon"
              className="shrink-0 h-10 w-10"
            >
              <Plus size={20} weight="bold" />
            </Button>
          </div>
        </header>

        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            DANH SÁCH QUỸ
          </h2>
          
          {isLoading ? (
            <Card className="p-8 text-center border-dashed">
              <p className="text-sm text-muted-foreground">Đang tải danh sách quỹ...</p>
            </Card>
          ) : funds.length === 0 ? (
            <Card className="p-8 text-center border-dashed space-y-3">
              <p className="text-sm text-muted-foreground">Chưa có quỹ nào. Tạo quỹ đầu tiên để bắt đầu!</p>
              {onRefresh && (
                <Button variant="ghost" size="sm" onClick={onRefresh}>
                  Tải lại
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-2">
              {funds.map((fund) => (
                <Card
                  key={fund.id}
                  className="p-4 cursor-pointer hover:bg-accent/50 transition-all group border-border/50"
                  onClick={() => onSelectFund(fund.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {fund.type === 'shared' ? (
                          <Users size={22} className="text-primary" weight="duotone" />
                        ) : (
                          <Wallet size={22} className="text-primary" weight="duotone" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">{fund.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users size={12} weight="fill" />
                          {fund.memberIds.length} thành viên
                        </p>
                      </div>
                    </div>
                    <CaretRight
                      size={20}
                      className="text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all shrink-0"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
