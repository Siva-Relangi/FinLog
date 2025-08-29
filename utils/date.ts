import { format, isSameDay, isSameWeek, isSameMonth, startOfWeek } from 'date-fns'

export function formatHeaderDate(iso: string) {
  return format(new Date(iso), 'MMM d, yyyy')
}

export function isTodayISO(iso: string) {
  const d = new Date(iso)
  return isSameDay(d, new Date())
}

export function isThisWeekISO(iso: string) {
  const d = new Date(iso)
  return isSameWeek(d, new Date(), { weekStartsOn: 1 }) // Monday start
}

export function isThisMonthISO(iso: string) {
  const d = new Date(iso)
  return isSameMonth(d, new Date())
}

export function groupByDate<T extends { date: string }>(items: T[]) {
  const map = new Map<string, T[]>()
  items.forEach((it) => {
    const key = format(new Date(it.date), 'yyyy-MM-dd')
    map.set(key, [...(map.get(key) || []), it])
  })
  // Sort groups by date desc:
  return Array.from(map.entries()).sort(([a], [b]) => (a < b ? 1 : -1))
}