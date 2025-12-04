import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PencilSimple, Trash } from '@phosphor-icons/react'
import { Transaction } from '@/lib/types'
import { formatCurrency } from '@/lib/currency'
import { EditTransactionDialog } from './EditTransactionDialog'

interface TransactionListProps {
  transactions: Transaction[]
  onUpdate: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionList({ transactions, onUpdate, onDelete }: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp)

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">Chưa có giao dịch nào</p>
        <p className="text-sm mt-2">Thêm giao dịch đầu tiên của bạn ở trên</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead className="text-right">Chi tiêu</TableHead>
              <TableHead className="text-right">Thu nhập</TableHead>
              <TableHead className="hidden sm:table-cell">Thời gian</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.userName}</TableCell>
                <TableCell>{transaction.content}</TableCell>
                <TableCell className="text-right">
                  {transaction.spend !== null ? (
                    <Badge variant="destructive" className="font-mono">
                      {formatCurrency(transaction.spend)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.earn !== null ? (
                    <Badge className="font-mono bg-accent text-accent-foreground hover:bg-accent/90">
                      {formatCurrency(transaction.earn)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                  {formatDate(transaction.timestamp)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTransaction(transaction)}
                      className="h-8 w-8"
                    >
                      <PencilSimple />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(transaction.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditTransactionDialog
        transaction={editingTransaction}
        open={editingTransaction !== null}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        onSave={onUpdate}
      />
    </>
  )
}
