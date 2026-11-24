import { onMounted, onUnmounted, ref } from 'vue'
import api from '@/api'

interface BookingSummary {
  pendingAppointments: number
  unreadApplicants: number
  totalApplicants: number
  scheduledToday: number
}

const summary = ref<BookingSummary | null>(null)
const error = ref(false)
let subscribers = 0
let interval: ReturnType<typeof setInterval> | undefined
let request: AbortController | null = null

const today = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export async function refreshBookingSummary() {
  if (!subscribers) return
  request?.abort()
  const current = new AbortController()
  request = current
  try {
    const response = await api.get<BookingSummary>('/programs/bookings/summary', {
      params: { date: today() },
      signal: current.signal,
    })
    if (!current.signal.aborted) {
      summary.value = response.data
      error.value = false
    }
  } catch (err) {
    if (!current.signal.aborted) {
      error.value = true
      console.error('Failed to load booking summary', err)
    }
  } finally {
    if (request === current) request = null
  }
}

const onVisibilityChange = () => {
  if (!document.hidden) void refreshBookingSummary()
}

export function useBookingSummary() {
  onMounted(() => {
    subscribers++
    if (subscribers === 1) {
      void refreshBookingSummary()
      interval = setInterval(() => {
        if (!document.hidden && !request) void refreshBookingSummary()
      }, 3000)
      document.addEventListener('visibilitychange', onVisibilityChange)
    }
  })
  onUnmounted(() => {
    subscribers--
    if (subscribers === 0) {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      request?.abort()
      request = null
      summary.value = null
      error.value = false
    }
  })
  return { summary, error, refresh: refreshBookingSummary }
}
