import { useState } from 'react'
import { Category, Transaction } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Plus, Trash, PencilSimple, X, Check } from '@phosphor-icons/react'
import { canDeleteCategory } from '@/lib/categories'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CategoryManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  transactions: Transaction[]
  onCreateCategory: (name: string, description: string) => void
  onUpdateCategory: (categoryId: string, name: string, description: string) => void
  onDeleteCategory: (categoryId: string) => void
}

export function CategoryManagementDialog({
  open,
  onOpenChange,
  categories,
  transactions,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagementDialogProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Tên danh mục không được để trống')
      return
    }
    if (!description.trim()) {
      toast.error('Mô tả không được để trống')
      return
    }

    onCreateCategory(name.trim(), description.trim())
    setName('')
    setDescription('')
    setIsCreating(false)
    toast.success('Đã tạo danh mục!')
  }

  const handleUpdate = (categoryId: string) => {
    if (!name.trim()) {
      toast.error('Tên danh mục không được để trống')
      return
    }
    if (!description.trim()) {
      toast.error('Mô tả không được để trống')
      return
    }

    onUpdateCategory(categoryId, name.trim(), description.trim())
    setName('')
    setDescription('')
    setEditingId(null)
    toast.success('Đã cập nhật danh mục!')
  }

  const handleDelete = (categoryId: string) => {
    if (!canDeleteCategory(categoryId, transactions)) {
      toast.error('Không thể xóa', {
        description: 'Danh mục này đang được sử dụng trong các giao dịch',
      })
      return
    }

    onDeleteCategory(categoryId)
    toast.success('Đã xóa danh mục!')
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setName(category.name)
    setDescription(category.description)
    setIsCreating(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    setName('')
    setDescription('')
  }

  const startCreate = () => {
    setIsCreating(true)
    setEditingId(null)
    setName('')
    setDescription('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Quản lý danh mục</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <Button onClick={startCreate} className="gap-2 w-full" disabled={isCreating || editingId !== null}>
            <Plus weight="bold" />
            Tạo danh mục mới
          </Button>

          {(isCreating || editingId) && (
            <Card className="p-4 space-y-3 border-primary/50">
              <div className="space-y-2">
                <Label htmlFor="category-name">Tên danh mục</Label>
                <Input
                  id="category-name"
                  placeholder="VD: Siêu thị, Ăn uống, Di chuyển..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-description">Mô tả</Label>
                <Textarea
                  id="category-description"
                  placeholder="Mô tả để AI hiểu cách phân loại, VD: Những chi tiêu cho việc mua sắm ở siêu thị"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                {isCreating ? (
                  <>
                    <Button onClick={handleCreate} className="gap-2 flex-1">
                      <Check weight="bold" />
                      Tạo
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} className="gap-2">
                      <X weight="bold" />
                      Hủy
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => handleUpdate(editingId!)} className="gap-2 flex-1">
                      <Check weight="bold" />
                      Lưu
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} className="gap-2">
                      <X weight="bold" />
                      Hủy
                    </Button>
                  </>
                )}
              </div>
            </Card>
          )}

          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-4">
              {categories.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground text-sm">Chưa có danh mục nào</p>
                </Card>
              ) : (
                categories.map((category) => {
                  const usageCount = transactions.filter((t) => t.categoryId === category.id).length
                  const isBeingEdited = editingId === category.id

                  return (
                    <Card
                      key={category.id}
                      className={`p-4 ${isBeingEdited ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm">{category.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {category.description}
                          </p>
                          {usageCount > 0 && (
                            <p className="text-xs text-primary mt-2">
                              Đang sử dụng: {usageCount} giao dịch
                            </p>
                          )}
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(category)}
                            disabled={isCreating || editingId !== null}
                          >
                            <PencilSimple />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            disabled={isCreating || editingId !== null || usageCount > 0}
                          >
                            <Trash className={usageCount > 0 ? 'text-muted-foreground' : 'text-destructive'} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
