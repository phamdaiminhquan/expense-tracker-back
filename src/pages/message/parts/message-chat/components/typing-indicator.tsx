/**
 * TypingIndicator — Hiển thị ai đang nhập tin nhắn
 *
 * Hiển thị animation dots + tên người đang gõ.
 * Chỉ hiện khi có users khác đang typing.
 */

interface TypingUser {
  userId: string
  userName: string
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[]
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null

  const names = typingUsers.map(u => u.userName || 'Ai đó')
  let text: string

  if (names.length === 1) {
    text = `${names[0]} đang nhập...`
  } else if (names.length === 2) {
    text = `${names[0]} và ${names[1]} đang nhập...`
  } else {
    text = `${names[0]} và ${names.length - 1} người khác đang nhập...`
  }

  return (
    <div className="px-4 py-1.5 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
      {/* Animated dots */}
      <span className="inline-flex items-center gap-0.5">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </span>
      <span>{text}</span>
    </div>
  )
}
