import { useState } from 'react'
import { Category, Message } from '@/lib/types'
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
import React from 'react'

interface CategoryManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  messages: Message[]
  onCreateCategory: (name: string, description: string) => void
  onUpdateCategory: (categoryId: string, name: string, description: string) => void
  onDeleteCategory: (categoryId: string) => void
}

export function CategoryManagementDialog({
  open,
  onOpenChange,
  categories,
  messages,
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
    if (!canDeleteCategory(categoryId, messages)) {
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
          <DialogTitle className="text-2xl font-bold">Quản lý danh mục</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <Button 
            onClick={startCreate} 
            className="gap-2 w-full shadow-md hover:shadow-lg transition-all" 
            disabled={isCreating || editingId !== null}
          >
            <Plus weight="bold" />
            Tạo danh mục mới
          </Button>

          {(isCreating || editingId) && (
            <Card className="p-5 space-y-4 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent shadow-md">
              <div className="space-y-2">
                <Label htmlFor="category-name" className="text-sm font-semibold">Tên danh mục</Label>
                <Input
                  id="category-name"
                  placeholder="VD: Siêu thị, Ăn uống, Di chuyển..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-description" className="text-sm font-semibold">Mô tả</Label>
                <Textarea
                  id="category-description"
                  placeholder="Mô tả để AI hiểu cách phân loại, VD: Những chi tiêu cho việc mua sắm ở siêu thị"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              <div className="flex gap-2">
                {isCreating ? (
                  <React.Fragment>
                    <Button onClick={handleCreate} className="gap-2 flex-1 shadow-md hover:shadow-lg transition-all">
                      <Check weight="bold" />
                      Tạo
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} className="gap-2 shadow-sm">
                      <X weight="bold" />
                      Hủy
                    </Button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Button onClick={() => handleUpdate(editingId!)} className="gap-2 flex-1 shadow-md hover:shadow-lg transition-all">
                      <Check weight="bold" />
                      Lưu
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} className="gap-2 shadow-sm">
                      <X weight="bold" />
                      Hủy
                    </Button>
                  </React.Fragment>
                )}
              </div>
            </Card>
          )}

          <ScrollArea className="flex-1">
            <div className="space-y-3 pr-4">
              {categories.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 bg-muted/20">
                  <p className="text-muted-foreground text-sm">Chưa có danh mục nào</p>
                </Card>
              ) : (
                categories.map((category) => {
                  const usageCount = messages.filter((t) => t.categoryId === category.id).length
                  const isBeingEdited = editingId === category.id

                  return (
                    <Card
                      key={category.id}
                      className={`p-4 border-border/50 shadow-sm hover:shadow-md transition-all ${isBeingEdited ? 'opacity-50' : 'hover:border-primary/30'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base">{category.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                            {category.description}
                          </p>
                          {usageCount > 0 && (
                            <p className="text-xs text-primary mt-2 font-medium">
                              Đang sử dụng: {usageCount} giao dịch
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(category)}
                            disabled={isCreating || editingId !== null}
                            className="hover:bg-muted/50 rounded-lg"
                          >
                            <PencilSimple size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            disabled={isCreating || editingId !== null || usageCount > 0}
                            className="hover:bg-destructive/10 rounded-lg"
                          >
                            <Trash size={18} className={usageCount > 0 ? 'text-muted-foreground' : 'text-destructive'} />
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
