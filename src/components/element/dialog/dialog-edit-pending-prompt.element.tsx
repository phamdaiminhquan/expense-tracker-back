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
import { Message, Category } from '@/lib/types'
import { toast } from 'sonner'
import { SpinnerGap } from '@phosphor-icons/react'
import React from 'react'

interface EditPendingPromptDialogProps {
  message: Message | null
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (message: Message) => void
}

export function EditPendingPromptDialog({
  message,
  categories,
  open,
  onOpenChange,
  onSave,
}: EditPendingPromptDialogProps) {
  const [promptText, setPromptText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (message) {
      setPromptText(message.originalPrompt || message.message)
    }
  }, [message])

  const handleProcess = async () => {
    if (!message || !promptText.trim()) return

    setIsLoading(true)

    try {
      // Update message with new prompt and set status to 'pending' to trigger AI processing
      await onSave({
        ...message,
        message: promptText.trim(),
        originalPrompt: promptText.trim(),
        isPendingPrompt: true,
        status: 'pending',
        spend: null,
        earn: null,
        categoryId: null,
      })

      toast.success('Đã cập nhật prompt, AI sẽ xử lý lại.', {
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Chỉnh sửa và xử lý ghi chú</DialogTitle>
          <DialogDescription className="text-base">
            Chỉnh sửa prompt và xử lý lại để tạo giao dịch hợp lệ. Thời gian giao dịch sẽ là thời điểm bạn tạo ghi chú ban đầu.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pending-prompt" className="text-sm font-semibold">Prompt giao dịch</Label>
            <Input
              id="pending-prompt"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="VD: bánh tráng trộn 35"
              disabled={isLoading}
              className="h-11 transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
            />
            <p className="text-xs text-muted-foreground">
              Mô tả giao dịch và số tiền (VD: "cơm trưa 45" hoặc "nhận lương 5000")
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="shadow-sm">
            Hủy
          </Button>
          <Button onClick={handleProcess} disabled={isLoading || !promptText.trim()} className="shadow-md hover:shadow-lg transition-all">
            {isLoading ? (
              <React.Fragment>
                <SpinnerGap className="animate-spin mr-2" />
                Đang xử lý...
              </React.Fragment>
            ) : (
              'Xử lý'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
