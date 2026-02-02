<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentDate: Date
  schedules: any[]
}>()

const emit = defineEmits(['dayClick', 'eventClick'])

const calendarDays = computed(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const lastDay = new Date(year, month + 1, 0).getDate()

  let startDay = firstDay === 0 ? 6 : firstDay - 1
  const days = []
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month - 1, prevMonthLastDay - i), isCurrentMonth: false })
  }
  for (let i = 1; i <= lastDay; i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
  }
  return days
})

const getEventsForDay = (date: Date) => {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return props.schedules.filter((s) => s.date === dateStr)
}

const getStatusClass = (status: string) => {
  const s = status?.toLowerCase()
  if (s === 'waiting' || s === 'pending') return 'bg-orange-400'
  if (s === 'available') return 'bg-[#4CC9C0]'
  return 'bg-slate-400'
}
</script>

<template>
  <div
    class="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/40"
  >
    <div class="grid grid-cols-7 border-b border-gray-50 bg-gray-50/30">
      <div
        v-for="d in ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN']"
        :key="d"
        class="py-5 text-center text-[10px] font-black text-gray-400 tracking-[0.3em]"
      >
        {{ d }}
      </div>
    </div>
    <div class="grid grid-cols-7">
      <div
        v-for="(day, i) in calendarDays"
        :key="i"
        @click="emit('dayClick', day)"
        class="min-h-[130px] border-r border-b border-gray-50 p-3 transition-all hover:bg-gray-50/80 cursor-pointer group relative"
        :class="{ 'bg-gray-50/20 opacity-40': !day.isCurrentMonth }"
      >
        <div class="flex justify-between items-start mb-2">
          <span
            class="text-sm font-black"
            :class="day.isCurrentMonth ? 'text-gray-700' : 'text-gray-300'"
          >
            {{ day.date.getDate() }}
          </span>
          <div
            class="w-1.5 h-1.5 rounded-full bg-[#4CC9C0] opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
        </div>

        <div class="space-y-1.5">
          <div
            v-for="event in getEventsForDay(day.date).slice(0, 3)"
            :key="event.id"
            @click.stop="emit('eventClick', event)"
            class="px-2 py-1.5 rounded-xl text-[9px] font-black text-white truncate shadow-sm uppercase tracking-tighter transition-transform hover:scale-[1.02]"
            :class="getStatusClass(event.status)"
          >
            {{ event.startTime.slice(0, 5) }} •
            {{ event.teacher?.user?.fullName?.split(' ')[0] || 'Guru' }}
          </div>
          <div
            v-if="getEventsForDay(day.date).length > 3"
            class="text-[9px] font-black text-[#4CC9C0] pl-1 pt-1"
          >
            +{{ getEventsForDay(day.date).length - 3 }} LAINNYA
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
