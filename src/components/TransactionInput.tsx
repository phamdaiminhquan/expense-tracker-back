import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, SpinnerGap } from '@phosphor-icons/react'
import { parseExpenseText, validatePrompt, APISystemError, InvalidPromptError } from '@/lib/gemini'
import { toast } from 'sonner'
import { Transaction } from '@/lib/types'

interface TransactionInputProps {
  onAdd: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void
  currentUserName: string
}

export function TransactionInput({ onAdd, currentUserName }: TransactionInputProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) return

    const validation = validatePrompt(input.trim())
    if (!validation.valid) {
      toast.error('Prompt không hợp lệ', {
        description: validation.error,
      })
      return
    }

    setIsLoading(true)
    const promptText = input.trim()
    const promptTimestamp = Date.now()

    try {
      const parsed = await parseExpenseText(promptText)
      
      onAdd({
        userId: '',
        userName: currentUserName,
        spend: parsed.spend,
        earn: parsed.earn,
        content: parsed.content,
        isPendingPrompt: false,
        promptCreatedAt: promptTimestamp,
      })

      toast.success('Đã thêm giao dịch thành công!', {
        description: parsed.content,
      })

      setInput('')
    } catch (error) {
      if (error instanceof APISystemError) {
        onAdd({
          userId: '',
          userName: currentUserName,
          spend: null,
          earn: null,
          content: promptText,
          isPendingPrompt: true,
          originalPrompt: promptText,
          promptCreatedAt: promptTimestamp,
        })

        toast.error('Lỗi hệ thống', {
          description: `${error.message}. Prompt đã được lưu để xử lý sau.`,
          duration: 5000,
        })

        setInput('')
      } else if (error instanceof InvalidPromptError) {
        toast.error('Không thể phân tích prompt', {
          description: error.message,
          duration: 5000,
        })
      } else {
        toast.error('Có lỗi xảy ra', {
          description: 'Vui lòng thử lại',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập giao dịch (VD: bánh tráng trộn 35)"
        disabled={isLoading}
        className="flex-1 text-base"
        id="transaction-input"
      />
      <Button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="gap-2 px-6"
      >
        {isLoading ? (
          <SpinnerGap className="animate-spin" />
        ) : (
          <Plus />
        )}
        Thêm
      </Button>
    </form>
  )
}
