import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendDown, TrendUp, Wallet, ChartBar } from '@phosphor-icons/react'
import { Message, Fund } from '@/lib/types'
import { formatFullCurrency } from '@/lib/currency'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FundStatisticsProps {
  messages: Message[]
  fund: Fund | null
}

type TimeFilter = 'all' | 'day' | 'week' | 'month' | 'year'

export function FundStatistics({ messages, fund }: FundStatisticsProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [showPerUser, setShowPerUser] = useState(false)

  const validMessages = messages.filter((t) => !t.isPendingPrompt)

  const filterMessagesByTime = (txns: Message[]): Message[] => {
    if (timeFilter === 'all') return txns

    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000
    let cutoffTime = 0

    switch (timeFilter) {
      case 'day':
        cutoffTime = now - oneDayMs
        break
      case 'week':
        cutoffTime = now - 7 * oneDayMs
        break
      case 'month':
        cutoffTime = now - 30 * oneDayMs
        break
      case 'year':
        cutoffTime = now - 365 * oneDayMs
        break
    }

    return txns.filter((t) => t.timestamp >= cutoffTime)
  }

  const filteredMessages = filterMessagesByTime(validMessages)

  const totalSpend = filteredMessages.reduce((sum, t) => sum + (t.spend || 0), 0)
  const totalEarn = filteredMessages.reduce((sum, t) => sum + (t.earn || 0), 0)
  const netBalance = totalEarn - totalSpend

  const userStats = filteredMessages.reduce(
    (acc, t) => {
      if (!acc[t.userId]) {
        acc[t.userId] = {
          userName: t.userName,
          spend: 0,
          earn: 0,
        }
      }
      acc[t.userId].spend += t.spend || 0
      acc[t.userId].earn += t.earn || 0
      return acc
    },
    {} as Record<string, { userName: string; spend: number; earn: number }>
  )

  const isSharedFund = fund?.type === 'shared'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Thời gian:</span>
          <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="day">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isSharedFund && Object.keys(userStats).length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPerUser(!showPerUser)}
            className="gap-2"
          >
            <ChartBar />
            {showPerUser ? 'Ẩn chi tiết' : 'Xem theo người'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-destructive/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
              <div className="p-1.5 rounded-lg bg-destructive/20">
                <TrendDown className="text-destructive" size={16} weight="bold" />
              </div>
              Chi tiêu
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold font-mono text-destructive">
              {formatFullCurrency(totalSpend)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
              <div className="p-1.5 rounded-lg bg-accent/20">
                <TrendUp className="text-accent" size={16} weight="bold" />
              </div>
              Thu nhập
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold font-mono text-accent">
              {formatFullCurrency(totalEarn)}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-primary/30 ${netBalance >= 0 ? 'bg-gradient-to-br from-primary/10 to-primary/5' : 'bg-gradient-to-br from-destructive/10 to-destructive/5'} backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden relative`}
        >
          <div className={`absolute top-0 right-0 w-20 h-20 ${netBalance >= 0 ? 'bg-primary/10' : 'bg-destructive/10'} rounded-full blur-2xl -mr-10 -mt-10`} />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
              <div className={`p-1.5 rounded-lg ${netBalance >= 0 ? 'bg-primary/20' : 'bg-destructive/20'}`}>
                <Wallet
                  className={netBalance >= 0 ? 'text-primary' : 'text-destructive'}
                  size={16}
                  weight="bold"
                />
              </div>
              Còn lại
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div
              className={`text-3xl font-bold font-mono ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}
            >
              {formatFullCurrency(netBalance)}
            </div>
          </CardContent>
        </Card>
      </div>

        {isSharedFund && showPerUser && Object.keys(userStats).length > 0 && (
        <Card className="shadow-md border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Thống kê theo người</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(userStats).map(([userId, stats]) => (
                <div
                  key={userId}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-all shadow-sm"
                >
                  <div className="font-semibold text-foreground">{stats.userName}</div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-destructive font-mono font-semibold">
                      Chi: {formatFullCurrency(stats.spend)}
                    </div>
                    {stats.earn > 0 && (
                      <div className="text-accent font-mono font-semibold">
                        Thu: {formatFullCurrency(stats.earn)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
