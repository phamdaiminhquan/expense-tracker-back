import { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { CaretDown, CaretRight, FolderSimple, Tag } from '@phosphor-icons/react'
import {
  listAvailableCategories,
  subscribeAllCategories,
  subscribeAllChildrenOfParent,
  subscribeCategory,
  unsubscribeCategory,
} from '@/apis/categories/category.api'
import { AvailableCategoryDto } from '@/apis/categories/category.interface'
import { toast } from 'sonner'
import React from 'react'

interface CategorySubscriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fundId: string | null
  onSkip: () => void
}

const EMPTY_CATEGORIES: AvailableCategoryDto[] = []

function hasChildren(category: AvailableCategoryDto): boolean {
  return (category.children || []).length > 0
}

function getSubscribedChildren(category: AvailableCategoryDto): AvailableCategoryDto[] {
  return (category.children || []).filter((child) => Boolean(child.isSubscribed))
}

export function CategorySubscriptionDialog({
  open,
  onOpenChange,
  fundId,
  onSkip,
}: CategorySubscriptionDialogProps) {
  const [categories, setCategories] = useState<AvailableCategoryDto[]>(EMPTY_CATEGORIES)
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [busyIds, setBusyIds] = useState<string[]>([])
  const [isSubscribingAll, setIsSubscribingAll] = useState(false)

  const parentList = useMemo(() => categories || EMPTY_CATEGORIES, [categories])

  useEffect(() => {
    if (!open || !fundId) return

    let isActive = true
    setIsLoading(true)

    listAvailableCategories(fundId)
      .then((data) => {
        if (!isActive) return
        const next = data || EMPTY_CATEGORIES
        setCategories(next)
        setExpandedParents(Object.fromEntries(next.map((item) => [item.id, false])))
      })
      .catch((error) => {
        console.error(error)
        if (!isActive) return
        toast.error('Không tải được danh mục', { description: 'Vui lòng thử lại' })
      })
      .finally(() => {
        if (!isActive) return
        setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [open, fundId])

  const isBusy = (id: string) => busyIds.includes(id)

  const markBusy = (ids: string[]) => {
    setBusyIds((prev) => Array.from(new Set([...prev, ...ids])))
  }

  const unmarkBusy = (ids: string[]) => {
    setBusyIds((prev) => prev.filter((id) => !ids.includes(id)))
  }

  const updateChildSubscription = (parentId: string, childId: string, subscribed: boolean) => {
    setCategories((current) =>
      current.map((parent) => {
        if (parent.id !== parentId) return parent
        const children = (parent.children || []).map((child) =>
          child.id === childId ? { ...child, isSubscribed: subscribed } : child
        )
        return { ...parent, children }
      })
    )
  }

  const updateChildrenSubscription = (parentId: string, subscribed: boolean) => {
    setCategories((current) =>
      current.map((parent) => {
        if (parent.id !== parentId) return parent
        const children = (parent.children || []).map((child) => ({ ...child, isSubscribed: subscribed }))
        return { ...parent, children }
      })
    )
  }

  const handleSubscribeChild = async (parentId: string, childId: string) => {
    if (!fundId) return
    markBusy([childId])
    updateChildSubscription(parentId, childId, true)
    try {
      await subscribeCategory(fundId, childId)
      toast.success('Đã đăng ký danh mục')
    } catch (error) {
      console.error(error)
      updateChildSubscription(parentId, childId, false)
      toast.error('Đăng ký thất bại', { description: 'Vui lòng thử lại' })
    } finally {
      unmarkBusy([childId])
    }
  }

  const handleUnsubscribeChild = async (parentId: string, childId: string) => {
    if (!fundId) return
    markBusy([childId])
    updateChildSubscription(parentId, childId, false)
    try {
      await unsubscribeCategory(fundId, childId)
      toast.success('Đã hủy đăng ký')
    } catch (error) {
      console.error(error)
      updateChildSubscription(parentId, childId, true)
      toast.error('Hủy đăng ký thất bại', { description: 'Vui lòng thử lại' })
    } finally {
      unmarkBusy([childId])
    }
  }

  const handleSubscribeAllCategories = async () => {
    if (!fundId) return
    const previous = categories
    setIsSubscribingAll(true)
    setCategories((current) =>
      current.map((parent) => ({
        ...parent,
        children: (parent.children || []).map((child) => ({ ...child, isSubscribed: true })),
      }))
    )

    try {
      await subscribeAllCategories(fundId)
      toast.success('Đã đăng ký toàn bộ danh mục')
    } catch (error) {
      console.error(error)
      setCategories(previous)
      toast.error('Đăng ký toàn bộ thất bại', { description: 'Vui lòng thử lại' })
    } finally {
      setIsSubscribingAll(false)
    }
  }

  const handleSubscribeParent = async (parent: AvailableCategoryDto) => {
    if (!fundId) return
    if (!hasChildren(parent)) {
      toast.error('Danh mục này chưa có danh mục con')
      return
    }

    markBusy([parent.id])
    try {
      await subscribeAllChildrenOfParent(fundId, parent.id)
      updateChildrenSubscription(parent.id, true)
      toast.success('Đã đăng ký danh mục con')
    } catch (error) {
      console.error(error)
      toast.error('Đăng ký thất bại', { description: 'Vui lòng thử lại' })
    } finally {
      unmarkBusy([parent.id])
    }
  }

  const handleUnsubscribeParent = async (parent: AvailableCategoryDto) => {
    if (!fundId) return
    const subscribedChildren = getSubscribedChildren(parent)
    if (subscribedChildren.length === 0) return

    const childIds = subscribedChildren.map((child) => child.id)
    markBusy([parent.id, ...childIds])

    try {
      await Promise.all(childIds.map((childId) => unsubscribeCategory(fundId, childId)))
      updateChildrenSubscription(parent.id, false)
      toast.success('Đã hủy đăng ký danh mục')
    } catch (error) {
      console.error(error)
      toast.error('Hủy đăng ký thất bại', { description: 'Vui lòng thử lại' })
    } finally {
      unmarkBusy([parent.id, ...childIds])
    }
  }

  const renderParentBadge = (parent: AvailableCategoryDto) => {
    if (!hasChildren(parent)) return null
    const subscribedCount = getSubscribedChildren(parent).length
    const total = parent.children?.length || 0
    if (subscribedCount === 0) return null

    if (subscribedCount === total) {
      return <Badge className="bg-emerald-500/15 text-emerald-700">Đã đăng ký</Badge>
    }

    return <Badge variant="secondary">{subscribedCount}/{total} đã đăng ký</Badge>
  }

  const renderParentAction = (parent: AvailableCategoryDto) => {
    const total = parent.children?.length || 0
    const subscribedCount = getSubscribedChildren(parent).length
    const allSubscribed = total > 0 && subscribedCount === total

    if (total === 0) return null

    if (allSubscribed) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => handleUnsubscribeParent(parent)}
          disabled={isLoading || isSubscribingAll || isBusy(parent.id)}
        >
          Hủy đăng ký
        </Button>
      )
    }

    return (
      <Button
        size="sm"
        className="w-full sm:w-auto"
        onClick={() => handleSubscribeParent(parent)}
        disabled={isLoading || isSubscribingAll || isBusy(parent.id)}
      >
        Đăng ký tất cả
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Đăng ký danh mục chi tiêu</DialogTitle>
          <DialogDescription>
            Chọn những danh mục bạn muốn dùng. Bạn có thể bỏ qua và đăng ký sau.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleSubscribeAllCategories}
            disabled={isLoading || isSubscribingAll}
          >
            Đăng ký toàn bộ
          </Button>
        </div>

        <div className="flex-1 overflow-hidden min-h-0 flex flex-col gap-4">
          <ScrollArea className="flex-1 min-h-0 h-full overflow-x-hidden" style={{ scrollbarGutter: 'stable' }}>
            <div className="space-y-4 pr-2 sm:pr-4 w-full max-w-full">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Skeleton className="h-10 w-10 rounded-xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-56" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : parentList.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 bg-muted/20">
                  <p className="text-muted-foreground text-sm">Chưa có danh mục nào</p>
                </Card>
              ) : (
                parentList.map((parent) => (
                  <Collapsible
                    key={parent.id}
                    open={expandedParents[parent.id]}
                    onOpenChange={(nextOpen) =>
                      setExpandedParents((current) => ({ ...current, [parent.id]: nextOpen }))
                    }
                  >
                    <Card className="p-4 border-border/50 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <FolderSimple size={20} weight="duotone" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-base break-words sm:truncate">{parent.name}</p>
                              {renderParentBadge(parent)}
                            </div>
                            {parent.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {parent.description}
                              </p>
                            )}
                            {hasChildren(parent) && (
                              <p className="text-xs text-muted-foreground mt-2">
                                {getSubscribedChildren(parent).length}/{parent.children?.length || 0} danh mục con
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                          {renderParentAction(parent)}
                          {hasChildren(parent) && (
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                aria-label="Toggle"
                              >
                                {expandedParents[parent.id] ? (
                                  <CaretDown size={18} weight="bold" />
                                ) : (
                                  <CaretRight size={18} weight="bold" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          )}
                        </div>
                      </div>

                      {hasChildren(parent) && (
                        <CollapsibleContent className="w-full">
                          <div className="mt-4 space-y-2 border-l border-border/50 pl-4">
                            {(parent.children || []).map((child) => {
                              const isSubscribed = Boolean(child.isSubscribed)

                              return (
                                <div
                                  key={child.id}
                                  className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 p-3 w-full sm:w-[94%] sm:ml-auto min-w-0 max-w-full overflow-hidden"
                                >
                                  <div className="flex items-start gap-3 min-w-0 flex-1">
                                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                      <Tag size={16} weight="duotone" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-sm break-words sm:truncate">{child.name}</p>
                                      {child.description && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                          {child.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                                    <Button
                                      size="sm"
                                      className={
                                        isSubscribed
                                          ? 'w-full sm:min-w-[120px] sm:w-auto border-muted-foreground/40 text-muted-foreground hover:text-foreground hover:border-muted-foreground/70'
                                          : 'w-full sm:min-w-[120px] sm:w-auto'
                                      }
                                      variant={isSubscribed ? 'outline' : 'default'}
                                      onClick={() =>
                                        isSubscribed
                                          ? handleUnsubscribeChild(parent.id, child.id)
                                          : handleSubscribeChild(parent.id, child.id)
                                      }
                                      disabled={isLoading || isSubscribingAll || isBusy(child.id)}
                                    >
                                      {isSubscribed ? 'Hủy đăng ký' : 'Đăng ký'}
                                    </Button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </CollapsibleContent>
                      )}
                    </Card>
                  </Collapsible>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={onSkip} className="sm:w-1/2">
              Bỏ qua
            </Button>
            <Button onClick={() => onOpenChange(false)} className="sm:w-1/2">
              Tiếp tục
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
