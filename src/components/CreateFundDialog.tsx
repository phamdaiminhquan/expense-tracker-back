import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { FundType } from '@/lib/types'
import { User } from '@/lib/auth'
import { Users, User as UserIcon } from '@phosphor-icons/react'

interface CreateFundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateFund: (name: string, type: FundType, memberIds: string[]) => void
  currentUserId: string
  allUsers: User[]
}

export function CreateFundDialog({
  open,
  onOpenChange,
  onCreateFund,
  currentUserId,
  allUsers,
}: CreateFundDialogProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<FundType>('personal')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([currentUserId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const memberIds = type === 'shared' ? selectedMembers : [currentUserId]
    onCreateFund(name.trim(), type, memberIds)
    
    setName('')
    setType('personal')
    setSelectedMembers([currentUserId])
    onOpenChange(false)
  }

  const handleMemberToggle = (userId: string) => {
    if (userId === currentUserId) return
    
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo quỹ mới</DialogTitle>
          <DialogDescription>
            Tạo quỹ để quản lý thu chi riêng hoặc chung với người khác
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fund-name">Tên quỹ</Label>
            <Input
              id="fund-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Quỹ đi chơi, Quỹ sinh nhật..."
              className="text-base"
            />
          </div>

          <div className="space-y-3">
            <Label>Loại quỹ</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as FundType)}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="personal" id="personal" />
                <Label
                  htmlFor="personal"
                  className="flex-1 cursor-pointer flex items-center gap-2"
                >
                  <UserIcon weight="bold" className="text-secondary" />
                  <div>
                    <div className="font-medium">Quỹ riêng</div>
                    <div className="text-sm text-muted-foreground">
                      Chỉ bạn có thể sử dụng
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="shared" id="shared" />
                <Label htmlFor="shared" className="flex-1 cursor-pointer flex items-center gap-2">
                  <Users weight="bold" className="text-primary" />
                  <div>
                    <div className="font-medium">Quỹ chung</div>
                    <div className="text-sm text-muted-foreground">
                      Chia sẻ với nhiều người
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {type === 'shared' && (
            <div className="space-y-3">
              <Label>Thành viên</Label>
              <div className="space-y-2 border rounded-lg p-3">
                {allUsers.map((user) => {
                  const isCurrentUser = user.id === currentUserId
                  const isChecked = selectedMembers.includes(user.id)

                  return (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`member-${user.id}`}
                        checked={isChecked}
                        onCheckedChange={() => handleMemberToggle(user.id)}
                        disabled={isCurrentUser}
                      />
                      <Label
                        htmlFor={`member-${user.id}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {user.name}
                        {isCurrentUser && (
                          <span className="text-muted-foreground ml-1">(Bạn)</span>
                        )}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Tạo quỹ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
