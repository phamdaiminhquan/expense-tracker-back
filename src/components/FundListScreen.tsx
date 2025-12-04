import { Fund } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Users, User, CaretRight, SignOut } from '@phosphor-icons/react'
import { MOCK_USERS } from '@/lib/auth'

interface FundListScreenProps {
  funds: Fund[]
  currentUserId: string
  currentUserName: string
  onSelectFund: (fundId: string) => void
  onCreateFund: () => void
  onLogout: () => void
}

export function FundListScreen({
  funds,
  currentUserId,
  currentUserName,
  onSelectFund,
  onCreateFund,
  onLogout,
}: FundListScreenProps) {
  const getMemberNames = (memberIds: string[]) => {
    return memberIds
      .map((id) => MOCK_USERS.find((u) => u.id === id)?.name || 'Unknown')
      .join(', ')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold flex items-center gap-3">
                Chi Tiêu Thông Minh
              </h1>
              <p className="text-muted-foreground text-lg">
                Quản lý chi tiêu với trí tuệ nhân tạo - chỉ cần nhập, AI sẽ lo
              </p>
            </div>
            <Button variant="outline" onClick={onLogout} className="gap-2 shrink-0">
              <SignOut />
              Đăng xuất
            </Button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Xin chào,</p>
              <p className="text-lg font-semibold">{currentUserName}</p>
            </div>
            <Button onClick={onCreateFund} className="gap-2">
              <Plus weight="bold" />
              Tạo quỹ mới
            </Button>
          </div>
        </header>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Quỹ của bạn</h2>
          
          {funds.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Chưa có quỹ nào</p>
              <Button onClick={onCreateFund} className="mt-4 gap-2">
                <Plus weight="bold" />
                Tạo quỹ đầu tiên
              </Button>
            </Card>
          ) : (
            <div className="space-y-2">
              {funds.map((fund) => (
                <Card
                  key={fund.id}
                  className="p-4 cursor-pointer hover:bg-accent/50 transition-colors group"
                  onClick={() => onSelectFund(fund.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {fund.type === 'shared' ? (
                          <Users size={20} className="text-primary" weight="fill" />
                        ) : (
                          <User size={20} className="text-primary" weight="fill" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{fund.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {fund.type === 'shared'
                            ? `${fund.memberIds.length} thành viên: ${getMemberNames(fund.memberIds)}`
                            : 'Quỹ cá nhân'}
                        </p>
                      </div>
                    </div>
                    <CaretRight
                      size={20}
                      className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
