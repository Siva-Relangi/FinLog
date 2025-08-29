import type { Expense } from '../types'

export function applySearch(expenses: Expense[], query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return expenses
  return expenses.filter((e) => (e.note || '').toLowerCase().includes(q))
}

export function applyCategory(expenses: Expense[], categoryId?: string) {
  if (!categoryId) return expenses
  return expenses.filter((e) => e.categoryId === categoryId)
}

export function sortExpenses(expenses: Expense[], sortBy: 'latest' | 'amount') {
  if (sortBy === 'amount') {
    return [...expenses].sort((a, b) => b.amount - a.amount)
  }
  // latest first
  return [...expenses].sort((a, b) => +new Date(b.date) - +new Date(a.date))
}