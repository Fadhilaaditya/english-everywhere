<script setup lang="ts">
import { Clock, User, Video, Trash2, MonitorPlay, Loader2 } from 'lucide-vue-next'

defineProps<{
  items: any[]
  isLoading: boolean
  formatDate: Function
  isPast: Function
}>()

defineEmits(['delete'])
</script>

<template>
  <div class="space-y-6">
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-50"
    >
      <Loader2 class="w-8 h-8 animate-spin text-[#4CC9C0] mb-2" />
      <p class="text-sm text-gray-400 font-medium tracking-tight">Menyinkronkan jadwal...</p>
    </div>

    <div
      v-else-if="items.length === 0"
      class="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100"
    >
      <MonitorPlay class="w-12 h-12 text-gray-200 mx-auto mb-4" />
      <p class="text-gray-400 text-sm font-medium">Belum ada kelas terjadwal</p>
    </div>

    <div
      v-else
      v-for="item in items"
      :key="item.id"
      class="group relative bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 transition-all hover:shadow-md"
      :class="{ 'opacity-50 grayscale-[30%]': isPast(item.date, item.endTime) }"
    >
      <button
        @click="$emit('delete', item.id)"
        class="absolute -top-2 -right-2 p-2.5 bg-white text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700 border border-gray-50 z-10"
      >
        <Trash2 class="w-4 h-4" />
      </button>

      <div class="flex items-center gap-5">
        <div class="text-center min-w-[65px] bg-[#F1F3F9] p-3 rounded-2xl">
          <span class="block text-xl font-black text-gray-700">{{
            formatDate(item.date).day
          }}</span>
          <span class="text-[10px] uppercase font-black text-gray-400 tracking-tighter">{{
            formatDate(item.date).month
          }}</span>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span
              class="px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-50 text-blue-500 uppercase tracking-wider"
            >
              {{ item.program?.name || 'Program' }}
            </span>
          </div>
          <h4 class="font-extrabold text-gray-800 text-base truncate">
            {{ item.topic || 'No Topic' }}
          </h4>

          <div class="grid grid-cols-2 gap-y-2 mt-4 border-t border-gray-50 pt-4">
            <div class="flex items-center gap-2 text-[11px] font-bold text-gray-500">
              <Clock class="w-3.5 h-3.5 text-[#4CC9C0]" />
              {{ item.startTime.slice(0, 5) }} - {{ item.endTime.slice(0, 5) }}
            </div>
            <div class="flex items-center gap-2 text-[11px] font-bold text-gray-500">
              <User class="w-3.5 h-3.5 text-[#4CC9C0]" />
              <span class="truncate">{{ item.teacher?.user?.fullName || 'N/A' }}</span>
            </div>
          </div>

          <div v-if="item.meetingLink" class="mt-4">
            <a
              :href="item.meetingLink"
              target="_blank"
              class="inline-flex items-center gap-2 text-xs font-black text-[#4CC9C0] hover:text-[#3db3aa] group/link"
            >
              <Video class="w-4 h-4" />
              <span>JOIN CLASS</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
