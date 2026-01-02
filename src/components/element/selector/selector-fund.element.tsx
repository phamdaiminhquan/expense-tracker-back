import { Fund } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Users, User } from '@phosphor-icons/react'

interface FundSelectorProps {
  funds: Fund[]
  selectedFundId: string | null
  onSelectFund: (fundId: string) => void
  onCreateFund: () => void
  currentUserId: string
}

export function FundSelector({
  funds,
  selectedFundId,
  onSelectFund,
  onCreateFund,
  currentUserId,
}: FundSelectorProps) {
  const selectedFund = funds.find((f) => f.id === selectedFundId)

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <Select value={selectedFundId || undefined} onValueChange={onSelectFund}>
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              {selectedFund?.type === 'shared' ? (
                <Users weight="bold" className="text-primary" />
              ) : (
                <User weight="bold" className="text-secondary" />
              )}
              <SelectValue placeholder="Chọn quỹ" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {funds.map((fund) => (
              <SelectItem key={fund.id} value={fund.id}>
                <div className="flex items-center gap-2">
                  {fund.type === 'shared' ? (
                    <Users weight="bold" className="text-primary" size={16} />
                  ) : (
                    <User weight="bold" className="text-secondary" size={16} />
                  )}
                  <span>{fund.name}</span>
                  {fund.type === 'shared' && (
                    <span className="text-xs text-muted-foreground">
                      ({fund.memberIds.length} thành viên)
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onCreateFund} variant="outline" className="gap-2">
        <Plus />
        Tạo quỹ
      </Button>
    </div>
  )
}
