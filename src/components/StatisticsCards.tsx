import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendDown, TrendUp, Wallet } from '@phosphor-icons/react'
import { Message } from '@/lib/types'
import { formatFullCurrency } from '@/lib/currency'

interface StatisticsCardsProps {
  messages: Message[]
}

export function StatisticsCards({ messages }: StatisticsCardsProps) {
  const validMessages = messages.filter(t => !t.isPendingPrompt)
  
  const totalSpend = validMessages.reduce((sum, t) => sum + (t.spend || 0), 0)
  const totalEarn = validMessages.reduce((sum, t) => sum + (t.earn || 0), 0)
  const netBalance = totalEarn - totalSpend

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <Card className="border-destructive/40 bg-gradient-to-br from-destructive/15 to-destructive/8 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/15 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-destructive/20 transition-colors" />
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="text-xs font-bold flex items-center gap-3 text-muted-foreground uppercase tracking-widest">
            <div className="p-2 rounded-xl bg-destructive/25 shadow-lg">
              <TrendDown className="text-destructive" size={20} weight="bold" />
            </div>
            Chi tiêu
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-extrabold font-mono text-destructive">
            {formatFullCurrency(totalSpend)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/40 bg-gradient-to-br from-accent/15 to-accent/8 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/15 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/20 transition-colors" />
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="text-xs font-bold flex items-center gap-3 text-muted-foreground uppercase tracking-widest">
            <div className="p-2 rounded-xl bg-accent/25 shadow-lg">
              <TrendUp className="text-accent" size={20} weight="bold" />
            </div>
            Thu nhập
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-extrabold font-mono text-accent">
            {formatFullCurrency(totalEarn)}
          </div>
        </CardContent>
      </Card>

      <Card className={`border-primary/40 ${netBalance >= 0 ? 'bg-gradient-to-br from-primary/15 to-primary/8' : 'bg-gradient-to-br from-destructive/15 to-destructive/8'} backdrop-blur-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden relative group`}>
        <div className={`absolute top-0 right-0 w-32 h-32 ${netBalance >= 0 ? 'bg-primary/15 group-hover:bg-primary/20' : 'bg-destructive/15 group-hover:bg-destructive/20'} rounded-full blur-3xl -mr-16 -mt-16 transition-colors`} />
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="text-xs font-bold flex items-center gap-3 text-muted-foreground uppercase tracking-widest">
            <div className={`p-2 rounded-xl ${netBalance >= 0 ? 'bg-primary/25' : 'bg-destructive/25'} shadow-lg`}>
              <Wallet className={netBalance >= 0 ? 'text-primary' : 'text-destructive'} size={20} weight="bold" />
            </div>
            Còn lại
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className={`text-4xl font-extrabold font-mono ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {formatFullCurrency(netBalance)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
