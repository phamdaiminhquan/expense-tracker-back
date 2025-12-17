import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFunds } from '@/hooks/useFunds'
import { useCategories } from '@/hooks/useCategories'
import { useAuth } from '@/hooks/useAuth'
import { useMessages } from '@/hooks/useMessages'
import { MessagePage } from '@/pages/MessagePage'

export function MessageRoute() {
  const { fundId } = useParams()
  const navigate = useNavigate()

  const { visibleFunds, enterFund } = useFunds()
  const { currentUserId, currentUserName, resolveUserName } = useAuth()
  const {
    addMessage,
    updateMessage,
    deleteMessage,
    fetchMessagesByFund,
    getMessagesByFund,
    isProcessing,
  } = useMessages()
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories()

  const fund = useMemo(() => visibleFunds.find((f) => f.id === fundId), [fundId, visibleFunds])

  const fundCategories = useMemo(() => categories.filter((c) => c.fundId === fundId), [categories, fundId])
  const fundMessages = useMemo(() => getMessagesByFund(fundId || null), [fundId, getMessagesByFund])

  useEffect(() => {
    if (fund) enterFund(fund)
  }, [fund, enterFund])

  useEffect(() => {
    if (fundId) {
      fetchMessagesByFund(fundId)
    }
  }, [fundId, fetchMessagesByFund])

  if (!fund) return <div className="h-screen flex items-center justify-center text-sm text-gray-500">Không tìm thấy quỹ</div>

  return (
    <MessagePage
      fund={fund}
      messages={fundMessages}
      categories={fundCategories}
      currentUserId={currentUserId as string}
      currentUserName={currentUserName as string}
      resolveUserName={resolveUserName}
      onBack={() => navigate('/funds')}
      onAddMessage={addMessage}
      onUpdateMessage={updateMessage}
      onDeleteMessage={deleteMessage}
      onCreateCategory={(name, description) => createCategory(fundId || null, name, description)}
      onUpdateCategory={updateCategory}
      onDeleteCategory={deleteCategory}
      isProcessing={isProcessing}
    />
  )
}
