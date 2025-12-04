import { Transaction, Fund } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/currency'
import { MOCK_USERS } from '@/lib/auth'
import { Card } from '@/components/ui/card'
import { TrendUp, TrendDown, Wallet, User } from '@phosphor-icons/react'

interface FundStatisticsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactions: Transaction[]
  fund: Fund | null
}

export function FundStatisticsDialog({
  open,
  onOpenChange,
  transactions,
  fund,
}: FundStatisticsDialogProps) {
  const validTransactions = transactions.filter((t) => !t.isPendingPrompt)

  const totalSpend = validTransactions.reduce((sum, t) => sum + (t.spend || 0), 0)
  const totalEarn = validTransactions.reduce((sum, t) => sum + (t.earn || 0), 0)
  const balance = totalEarn - totalSpend

  const userStats =
    fund?.type === 'shared'
      ? fund.memberIds.map((userId) => {
          const userTransactions = validTransactions.filter((t) => t.userId === userId)
          const userName =
            MOCK_USERS.find((u) => u.id === userId)?.name || 'Unknown'
          const spend = userTransactions.reduce((sum, t) => sum + (t.spend || 0), 0)
          const earn = userTransactions.reduce((sum, t) => sum + (t.earn || 0), 0)
          return { userId, userName, spend, earn, count: userTransactions.length }
        })
      : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Báo cáo chi tiêu</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-destructive">
                <TrendDown size={20} weight="fill" />
                <span className="text-sm font-medium">Tổng chi</span>
              </div>
              <p className="text-2xl font-bold font-mono">{formatCurrency(totalSpend)}</p>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <TrendUp size={20} weight="fill" />
                <span className="text-sm font-medium">Tổng thu</span>
              </div>
              <p className="text-2xl font-bold font-mono">{formatCurrency(totalEarn)}</p>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Wallet size={20} weight="fill" />
                <span className="text-sm font-medium">Số dư</span>
              </div>
              <p
                className={`text-2xl font-bold font-mono ${
                  balance >= 0 ? 'text-accent' : 'text-destructive'
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
                  <Card key={stat.userId} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User size={20} className="text-primary" weight="fill" />
                        </div>
                        <div>
                          <p className="font-semibold">{stat.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {stat.count} giao dịch
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
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

          {validTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chưa có giao dịch hợp lệ nào để thống kê</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
