export function formatCurrency(amount: number | null): string {
  if (amount === null) return '—'
  return `${amount.toLocaleString()}k`
}

export function formatFullCurrency(amount: number | null): string {
  if (amount === null) return '—'
  return `${(amount * 1000).toLocaleString()} ₫`
}
