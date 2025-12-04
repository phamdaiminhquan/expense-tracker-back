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
import { Transaction } from '@/lib/types'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface EditTransactionDialogProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (transaction: Transaction) => void
}

export function EditTransactionDialog({
  transaction,
  open,
  onOpenChange,
  onSave,
}: EditTransactionDialogProps) {
  const [user, setUser] = useState('')
  const [amount, setAmount] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<'spend' | 'earn'>('spend')

  useEffect(() => {
    if (transaction) {
      setUser(transaction.user)
      setAmount(String(transaction.spend || transaction.earn || ''))
      setContent(transaction.content)
      setType(transaction.spend !== null ? 'spend' : 'earn')
    }
  }, [transaction])

  const handleSave = () => {
    if (!transaction || !user.trim() || !amount.trim() || !content.trim()) return

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return

    onSave({
      ...transaction,
      user: user.trim(),
      spend: type === 'spend' ? numAmount : null,
      earn: type === 'earn' ? numAmount : null,
      content: content.trim(),
    })

    onOpenChange(false)
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
              value={user}
              onChange={(e) => setUser(e.target.value)}
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
            <Label htmlFor="edit-content">Nội dung</Label>
            <Input
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mô tả giao dịch"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
