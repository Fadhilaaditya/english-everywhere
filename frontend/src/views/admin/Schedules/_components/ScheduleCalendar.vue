<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ currentDate: Date, schedules: any[] }>()
const emit = defineEmits(['dayClick', 'eventClick'])

const calendarDays = computed(() => {
    const year = props.currentDate.getFullYear()
    const month = props.currentDate.getMonth()
    
    // Mencari hari pertama (0 = Minggu, 1 = Senin, dst)
    const firstDay = new Date(year, month, 1).getDay()
    const lastDay = new Date(year, month + 1, 0).getDate()
    
    // Penyesuaian agar Senin adalah hari pertama (startDay 0 = Senin)
    let startDay = firstDay === 0 ? 6 : firstDay - 1
    
    const days = []
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    
    // Hari dari bulan sebelumnya
    for (let i = startDay - 1; i >= 0; i--) { 
        days.push({ 
            date: new Date(year, month - 1, prevMonthLastDay - i), 
            isCurrentMonth: false 
        }) 
    }
    
    // Hari bulan saat ini
    for (let i = 1; i <= lastDay; i++) { 
        days.push({ 
            date: new Date(year, month, i), 
            isCurrentMonth: true 
        }) 
    }
    
    // Hari bulan berikutnya (sampai genap 42 box kalender)
    while (days.length < 42) { 
        const nextDate = days.length - (startDay + lastDay) + 1
        days.push({ 
            date: new Date(year, month + 1, nextDate), 
            isCurrentMonth: false 
        }) 
    }
    return days
})

// PERBAIKAN: Gunakan fungsi yang lebih aman untuk membandingkan tanggal
const getEventsForDay = (date: Date) => {
    if (!props.schedules) return []
    
    // Buat string pembanding YYYY-MM-DD
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const searchStr = `${y}-${m}-${d}`
    
    return props.schedules.filter(s => {
        if (!s.date) return false
        // Pastikan substring mengambil bagian YYYY-MM-DD saja
        return s.date.startsWith(searchStr)
    })
}
</script>

<template>
    <div class="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-xl">
        <div class="grid grid-cols-7 border-b border-gray-50 bg-gray-50/30">
            <div v-for="d in ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN']" :key="d" 
                 class="py-5 text-center text-[10px] font-black text-gray-400">
                {{ d }}
            </div>
        </div>
        
        <div class="grid grid-cols-7">
            <div v-for="(day, i) in calendarDays" :key="i"
                 @click="emit('dayClick', day)"
                 class="min-h-[135px] border-r border-b border-gray-50 p-3 transition-all hover:bg-gray-50/80 cursor-pointer group"
                 :class="{'bg-gray-50/10 opacity-40': !day.isCurrentMonth}">
                
                <div class="flex justify-between items-start">
                    <span class="text-sm font-black" 
                          :class="day.isCurrentMonth ? 'text-gray-700' : 'text-gray-300'">
                        {{ day.date.getDate() }}
                    </span>
                </div>

                <div class="mt-2 space-y-1">
                    <div v-for="event in getEventsForDay(day.date).slice(0, 3)" :key="event.id"
                         @click.stop="emit('eventClick', event)"
                         class="px-2 py-1.5 rounded-xl text-[9px] font-black text-white bg-[#4CC9C0] truncate shadow-sm uppercase hover:brightness-95 transition-all">
                        {{ event.startTime?.slice(0,5) }} • {{ event.teacher?.user?.fullName?.split(' ')[0] || 'Guru' }}
                    </div>
                    
                    <div v-if="getEventsForDay(day.date).length > 3" class="text-[8px] text-center font-bold text-gray-400">
                        +{{ getEventsForDay(day.date).length - 3 }} lainnya
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>