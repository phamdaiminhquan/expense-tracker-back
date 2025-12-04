import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, SpinnerGap } from '@phosphor-icons/react'
import { parseExpenseText } from '@/lib/gemini'
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

    setIsLoading(true)

    try {
      const parsed = await parseExpenseText(input.trim())
      
      onAdd({
        userId: '',
        userName: currentUserName,
        spend: parsed.spend,
        earn: parsed.earn,
        content: parsed.content,
      })

      toast.success('Đã thêm giao dịch thành công!', {
        description: parsed.content,
      })

      setInput('')
    } catch (error) {
      toast.error('Không thể phân tích giao dịch', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại hoặc nhập lại',
      })
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
