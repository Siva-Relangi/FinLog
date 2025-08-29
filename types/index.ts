export type Category = {
  id: string
  name: string
  iconName?: string // optional emoji or icon name
}

export type Expense = {
  id: string
  amount: number
  categoryId: string
  note?: string
  date: string // ISO string
}

export type Filters = {
  categoryId?: string
  sortBy: 'latest' | 'amount'
  search: string
}