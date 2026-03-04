<script setup lang="ts">
import ScheduleItem from './ScheduleItem.vue'

const props = defineProps<{
  classes: any[]
  selectedDate: string
}>()

const formatDate = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  return new Date(dateStr).toLocaleDateString('id-ID', options)
}
</script>

<template>
  <div class="space-y-6">
    <h3 class="text-xl font-bold text-[#2D3748] px-2 flex flex-col gap-1">
      <div class="flex items-center justify-between w-full">
        Sesi Mengajar
        <span class="text-xs font-normal text-gray-400">{{ classes.length }} Sesi</span>
      </div>
      <span class="text-sm font-medium text-[#4CC9C0]">{{ formatDate(selectedDate) }}</span>
    </h3>
    
    <div v-if="classes.length === 0" class="text-center py-8 text-gray-400 italic bg-white rounded-[1.5rem] border border-gray-50 border-dashed">
        Belum ada jadwal.
    </div>

    <div v-else class="space-y-4">
      <ScheduleItem
        v-for="item in classes"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>
