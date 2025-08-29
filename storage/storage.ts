import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Category, Expense } from '../types'

const EXPENSES_KEY = 'pf.expenses.v1'
const CATEGORIES_KEY = 'pf.categories.v1'

export async function loadExpenses(): Promise<Expense[]> {
  const json = await AsyncStorage.getItem(EXPENSES_KEY)
  return json ? JSON.parse(json) : []
}

export async function saveExpenses(expenses: Expense[]) {
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
}

export async function loadCategories(): Promise<Category[]> {
  const json = await AsyncStorage.getItem(CATEGORIES_KEY)
  return json ? JSON.parse(json) : []
}

export async function saveCategories(categories: Category[]) {
  await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}

export async function clearAll() {
  await AsyncStorage.multiRemove([EXPENSES_KEY, CATEGORIES_KEY])
}