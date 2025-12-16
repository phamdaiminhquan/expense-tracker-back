import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Message } from '@/lib/types'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export interface EditMessageDialogProps {
  message: Message | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (message: Message) => void
  onDelete?: (id: string) => Promise<void>
}

export function EditMessageDialog({
  message,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: EditMessageDialogProps) {
  const [userName, setUserName] = useState('')
  const [amount, setAmount] = useState('')
  const [messages, setMessages] = useState('')
  const [type, setType] = useState<'spend' | 'earn'>('spend')

  useEffect(() => {
    if (message) {
      setUserName(message.userName)
      setAmount(String(message.spend || message.earn || ''))
      setMessages(message.message)
      setType(message.spend !== null ? 'spend' : 'earn')
    }
  }, [message])

  const handleSave = async () => {
    if (!message || !userName.trim() || !amount.trim() || !messages.trim()) return

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return

    try {
      await onSave({
        ...message,
        userName: userName.trim(),
        spend: type === 'spend' ? numAmount : null,
        earn: type === 'earn' ? numAmount : null,
        message: messages.trim(),
      })

      onOpenChange(false)
    } catch (error) {
      // Thông báo lỗi đã được xử lý ở provider
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa giao dịch</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-user">Người</Label>
            <Input
              id="edit-user"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Tên người"
            />
          </div>

          <div className="space-y-2">
            <Label>Loại giao dịch</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as 'spend' | 'earn')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spend" id="edit-spend" />
                <Label htmlFor="edit-spend" className="font-normal cursor-pointer">
                  Chi tiêu
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="earn" id="edit-earn" />
                <Label htmlFor="edit-earn" className="font-normal cursor-pointer">
                  Thu nhập
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Số tiền (ngàn đồng)</Label>
            <Input
              id="edit-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="35"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-message">Nội dung</Label>
            <Input
              id="edit-message"
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              placeholder="Mô tả giao dịch"
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex w-full items-center justify-between gap-2">
            <div>
              {onDelete && message && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={async () => {
                    try {
                      await onDelete(message.id)
                    } finally {
                      onOpenChange(false)
                    }
                  }}
                >
                  Xóa
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave}>Lưu</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
