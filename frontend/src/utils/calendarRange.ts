// The appointment calendars render a Monday-first grid of 42 local dates.
export function calendarRange(date: Date): { startDate: string; endDate: string } {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const mondayOffset = (first.getDay() + 6) % 7
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - mondayOffset)
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 41)
  const format = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
  return { startDate: format(start), endDate: format(end) }
}
