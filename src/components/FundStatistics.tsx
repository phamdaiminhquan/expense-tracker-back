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

        <Card
          className={`border-primary/20 ${netBalance >= 0 ? 'bg-primary/5' : 'bg-destructive/5'}`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
              <Wallet
                className={netBalance >= 0 ? 'text-primary' : 'text-destructive'}
                weight="bold"
              />
              Còn lại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold font-mono ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}
            >
              {formatFullCurrency(netBalance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {isSharedFund && showPerUser && Object.keys(userStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thống kê theo người</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(userStats).map(([userId, stats]) => (
                <div
                  key={userId}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="font-medium">{stats.userName}</div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-destructive font-mono">
                      Chi: {formatFullCurrency(stats.spend)}
                    </div>
                    {stats.earn > 0 && (
                      <div className="text-accent font-mono">
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
