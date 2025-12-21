import { Message, Fund, Category } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/currency'
import { Card } from '@/components/ui/card'
import { TrendUp, TrendDown, Wallet, User, Tag } from '@phosphor-icons/react'

interface FundStatisticsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messages: Message[]
  categories: Category[]
  fund: Fund | null
  resolveUserName: (userId: string) => string
}

export function FundStatisticsDialog({
  open,
  onOpenChange,
  messages,
  categories,
  fund,
  resolveUserName,
}: FundStatisticsDialogProps) {
  const validMessages = messages.filter((t) => !t.isPendingPrompt)

  const totalSpend = validMessages.reduce((sum, t) => sum + (t.spend || 0), 0)
  const totalEarn = validMessages.reduce((sum, t) => sum + (t.earn || 0), 0)
  const balance = totalEarn - totalSpend

  const userStats =
    fund?.type === 'shared'
      ? fund.memberIds.map((userId) => {
          const userMessages = validMessages.filter((t) => t.userId === userId)
          const userName = resolveUserName(userId)
          const spend = userMessages.reduce((sum, t) => sum + (t.spend || 0), 0)
          const earn = userMessages.reduce((sum, t) => sum + (t.earn || 0), 0)
          return { userId, userName, spend, earn, count: userMessages.length }
        })
      : []

  const categoryStats = categories.map((category) => {
    const categoryMessages = validMessages.filter((t) => t.categoryId === category.id)
    const spend = categoryMessages.reduce((sum, t) => sum + (t.spend || 0), 0)
    const earn = categoryMessages.reduce((sum, t) => sum + (t.earn || 0), 0)
    return {
      categoryId: category.id,
      categoryName: category.name,
      spend,
      earn,
      count: categoryMessages.length,
    }
  }).filter((stat) => stat.count > 0)

  const uncategorizedMessages = validMessages.filter((t) => !t.categoryId)
  const uncategorizedSpend = uncategorizedMessages.reduce((sum, t) => sum + (t.spend || 0), 0)
  const uncategorizedEarn = uncategorizedMessages.reduce((sum, t) => sum + (t.earn || 0), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Báo cáo chi tiêu</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 space-y-3 border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5 backdrop-blur-sm shadow-md hover:shadow-lg transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-destructive/10 rounded-full blur-xl -mr-8 -mt-8" />
              <div className="flex items-center gap-2 text-destructive relative z-10">
                <div className="p-1.5 rounded-lg bg-destructive/20">
                  <TrendDown size={18} weight="bold" />
                </div>
                <span className="text-sm font-semibold">Tổng chi</span>
              </div>
              <p className="text-2xl font-bold font-mono relative z-10">{formatCurrency(totalSpend)}</p>
            </Card>

            <Card className="p-5 space-y-3 border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm shadow-md hover:shadow-lg transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-full blur-xl -mr-8 -mt-8" />
              <div className="flex items-center gap-2 text-accent relative z-10">
                <div className="p-1.5 rounded-lg bg-accent/20">
                  <TrendUp size={18} weight="bold" />
                </div>
                <span className="text-sm font-semibold">Tổng thu</span>
              </div>
              <p className="text-2xl font-bold font-mono relative z-10">{formatCurrency(totalEarn)}</p>
            </Card>

            <Card className={`p-5 space-y-3 border-primary/30 ${balance >= 0 ? 'bg-gradient-to-br from-primary/10 to-primary/5' : 'bg-gradient-to-br from-destructive/10 to-destructive/5'} backdrop-blur-sm shadow-md hover:shadow-lg transition-all overflow-hidden relative`}>
              <div className={`absolute top-0 right-0 w-16 h-16 ${balance >= 0 ? 'bg-primary/10' : 'bg-destructive/10'} rounded-full blur-xl -mr-8 -mt-8`} />
              <div className={`flex items-center gap-2 ${balance >= 0 ? 'text-primary' : 'text-destructive'} relative z-10`}>
                <div className={`p-1.5 rounded-lg ${balance >= 0 ? 'bg-primary/20' : 'bg-destructive/20'}`}>
                  <Wallet size={18} weight="bold" />
                </div>
                <span className="text-sm font-semibold">Số dư</span>
              </div>
              <p
                className={`text-2xl font-bold font-mono relative z-10 ${
                  balance >= 0 ? 'text-primary' : 'text-destructive'
                }`}
              >
                {formatCurrency(balance)}
              </p>
            </Card>
          </div>

          {fund?.type === 'shared' && userStats.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Chi tiết theo người</h3>
              <div className="space-y-2">
                {userStats.map((stat) => (
                  <Card key={stat.userId} className="p-4 border-border/50 shadow-sm hover:shadow-md transition-all hover:border-primary/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 shadow-sm ring-1 ring-primary/10">
                          <User size={22} className="text-primary" weight="fill" />
                        </div>
                        <div>
                          <p className="font-semibold text-base">{stat.userName}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {stat.count} giao dịch
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1.5">
                        {stat.spend > 0 && (
                          <p className="text-sm">
                            Chi: <span className="font-mono font-semibold text-destructive">
                              {formatCurrency(stat.spend)}
                            </span>
                          </p>
                        )}
                        {stat.earn > 0 && (
                          <p className="text-sm">
                            Thu: <span className="font-mono font-semibold text-accent">
                              {formatCurrency(stat.earn)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {categoryStats.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Chi tiết theo danh mục</h3>
              <div className="space-y-2">
                {categoryStats.map((stat) => (
                  <Card key={stat.categoryId} className="p-4 border-border/50 shadow-sm hover:shadow-md transition-all hover:border-secondary/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/20 flex items-center justify-center shrink-0 shadow-sm ring-1 ring-secondary/20">
                          <Tag size={22} className="text-secondary-foreground" weight="fill" />
                        </div>
                        <div>
                          <p className="font-semibold text-base">{stat.categoryName}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {stat.count} giao dịch
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1.5">
                        {stat.spend > 0 && (
                          <p className="text-sm">
                            Chi: <span className="font-mono font-semibold text-destructive">
                              {formatCurrency(stat.spend)}
                            </span>
                          </p>
                        )}
                        {stat.earn > 0 && (
                          <p className="text-sm">
                            Thu: <span className="font-mono font-semibold text-accent">
                              {formatCurrency(stat.earn)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                
                {uncategorizedMessages.length > 0 && (
                  <Card className="p-4 border-dashed border-2 border-muted-foreground/30 bg-muted/10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                          <Tag size={22} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-muted-foreground">Chưa phân loại</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {uncategorizedMessages.length} giao dịch
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1.5">
                        {uncategorizedSpend > 0 && (
                          <p className="text-sm">
                            Chi: <span className="font-mono font-semibold text-destructive">
                              {formatCurrency(uncategorizedSpend)}
                            </span>
                          </p>
                        )}
                        {uncategorizedEarn > 0 && (
                          <p className="text-sm">
                            Thu: <span className="font-mono font-semibold text-accent">
                              {formatCurrency(uncategorizedEarn)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {validMessages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chưa có giao dịch hợp lệ nào để thống kê</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
