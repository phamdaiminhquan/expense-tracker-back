export function formatCurrency(amount: number | null): string {
  if (amount === null) return '—'
  
  // If amount >= 1000 (1.000k), display in millions (tr)
  if (amount >= 1000) {
    const millions = amount / 1000
    const rounded = Math.round(millions * 1000) / 1000
    const isWholeNumber = Math.abs(rounded - Math.round(rounded)) < 0.0001
    if (isWholeNumber) {
      return `${Math.round(rounded).toLocaleString()}tr`
    }
    // Format with up to 3 decimal places, but remove trailing zeros
    return `${rounded.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 3 })}tr`
  }
  
  // If amount < 1000, display in thousands (k)
  const rounded = Math.round(amount * 1000) / 1000
  const isWholeNumber = Math.abs(rounded - Math.round(rounded)) < 0.0001
  if (isWholeNumber) {
    return `${Math.round(rounded).toLocaleString()}k`
  }
  // Format with up to 3 decimal places, but remove trailing zeros
  return `${rounded.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 3 })}k`
}

export function formatFullCurrency(amount: number | null): string {
  if (amount === null) return '—'
  // Remove decimal part if it's .000 (e.g., 1.000 -> 1)
  const rounded = Math.round(amount * 1000) / 1000
  const isWholeNumber = Math.abs(rounded - Math.round(rounded)) < 0.0001
  const value = isWholeNumber ? Math.round(rounded) : rounded
  return `${(value * 1000).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ₫`
}
