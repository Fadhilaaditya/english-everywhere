<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  classes: any[]
  currentDate: Date
}>()

const emit = defineEmits(['prev', 'next'])

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthYearTitle = computed(() => {
  return props.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
    const year = props.currentDate.getFullYear()
    const month = props.currentDate.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    // Adjusted to start from Sunday (0)
    let startDay = firstDayOfMonth.getDay()
    
    const days = []
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    
    // Prev Month Days
    for (let i = startDay - 1; i >= 0; i--) {
        days.push({ 
            date: new Date(year, month - 1, prevMonthLastDay - i), 
            isCurrentMonth: false 
        })
    }
    
    // Current Month Days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        days.push({ 
            date: new Date(year, month, i), 
            isCurrentMonth: true 
        })
    }
    
    // Next Month Days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
        days.push({ 
            date: new Date(year, month + 1, i), 
            isCurrentMonth: false 
        })
    }
    
    return days
})

const getAppointmentsForDay = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${d}`
    
    return props.classes.filter(c => c.date === dateString)
}

const isDayBusy = (date: Date) => {
    return getAppointmentsForDay(date).length > 0
}
</script>

<template>
  <div class="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 h-fit">
    <div class="flex justify-between items-center mb-10">
      <h2 class="text-2xl font-bold text-[#2D3748]">{{ monthYearTitle }}</h2>
      <div class="flex gap-4">
          <button @click="emit('prev')" class="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <ChevronLeft class="w-6 h-6 text-gray-400" />
          </button>
          <button @click="emit('next')" class="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <ChevronRight class="w-6 h-6 text-gray-400" />
          </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-y-4 mb-4">
      <div v-for="day in weekDays" :key="day" class="text-center text-sm font-bold text-gray-400">
        {{ day }}
      </div>

      <div 
        v-for="(day, index) in calendarDays" 
        :key="index"
        class="aspect-square flex items-center justify-center relative rounded-3xl"
        :class="{'opacity-0 pointer-events-none': !day.isCurrentMonth}"
      >
        <div 
            v-if="day.isCurrentMonth"
            class="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-lg font-medium rounded-2xl transition-all"
            :class="[
                isDayBusy(day.date) 
                    ? 'bg-[#4CC9C0] text-white shadow-lg shadow-[#4CC9C0]/30' 
                    : 'text-gray-600'
            ]"
        >
            {{ day.date.getDate() }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure aspect ratio stays consistent */
.aspect-square {
    aspect-ratio: 1 / 1;
}
</style>
