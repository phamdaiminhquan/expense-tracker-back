export function formatCurrency(amount: number | null): string {
  if (amount === null) return '—'
  
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export function formatFullCurrency(amount: number | null): string {
  if (amount === null) return '—'
  
  return `${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫`
}
