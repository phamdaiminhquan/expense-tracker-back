import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendDown, TrendUp, Wallet } from '@phosphor-icons/react'
import { Transaction } from '@/lib/types'
import { formatFullCurrency } from '@/lib/currency'

interface StatisticsCardsProps {
  transactions: Transaction[]
}

export function StatisticsCards({ transactions }: StatisticsCardsProps) {
  const totalSpend = transactions.reduce((sum, t) => sum + (t.spend || 0), 0)
  const totalEarn = transactions.reduce((sum, t) => sum + (t.earn || 0), 0)
  const netBalance = totalEarn - totalSpend

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
            <TrendDown className="text-destructive" weight="bold" />
            Chi tiêu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-destructive">
            {formatFullCurrency(totalSpend)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/20 bg-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
            <TrendUp className="text-accent" weight="bold" />
            Thu nhập
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-accent">
            {formatFullCurrency(totalEarn)}
          </div>
        </CardContent>
      </Card>

      <Card className={`border-primary/20 ${netBalance >= 0 ? 'bg-primary/5' : 'bg-destructive/5'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
            <Wallet className={netBalance >= 0 ? 'text-primary' : 'text-destructive'} weight="bold" />
            Còn lại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold font-mono ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {formatFullCurrency(netBalance)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
