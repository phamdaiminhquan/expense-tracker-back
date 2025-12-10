import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Transaction, Category } from '@/lib/types'
import { toast } from 'sonner'
import { SpinnerGap } from '@phosphor-icons/react'

interface EditPendingPromptDialogProps {
  transaction: Transaction | null
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (transaction: Transaction) => Promise<void>
}

export function EditPendingPromptDialog({
  transaction,
  categories,
  open,
  onOpenChange,
  onSave,
}: EditPendingPromptDialogProps) {
  const [promptText, setPromptText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (transaction) {
      setPromptText(transaction.originalPrompt || transaction.content)
    }
  }, [transaction])

  const handleProcess = async () => {
    if (!transaction || !promptText.trim()) return

    setIsLoading(true)

    try {
      await onSave({
        ...transaction,
        content: promptText.trim(),
        originalPrompt: promptText.trim(),
        isPendingPrompt: true,
        status: 'pending',
        spend: null,
        earn: null,
        categoryId: null,
      })

      toast.success('Đã lưu ghi chú, backend sẽ xử lý.', {
        description: promptText.trim(),
      })

      onOpenChange(false)
    } catch (error) {
      toast.error('Có lỗi xảy ra', {
        description: 'Vui lòng thử lại',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa và xử lý ghi chú</DialogTitle>
          <DialogDescription>
            Chỉnh sửa prompt và xử lý lại để tạo giao dịch hợp lệ. Thời gian giao dịch sẽ là thời điểm bạn tạo ghi chú ban đầu.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pending-prompt">Prompt giao dịch</Label>
            <Input
              id="pending-prompt"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="VD: bánh tráng trộn 35"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Mô tả giao dịch và số tiền (VD: "cơm trưa 45" hoặc "nhận lương 5000")
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleProcess} disabled={isLoading || !promptText.trim()}>
            {isLoading ? (
              <>
                <SpinnerGap className="animate-spin mr-2" />
                Đang xử lý...
              </>
            ) : (
              'Xử lý'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
