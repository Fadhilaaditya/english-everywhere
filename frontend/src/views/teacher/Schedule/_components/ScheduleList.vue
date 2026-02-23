<script setup lang="ts">
import ScheduleItem from './ScheduleItem.vue'

defineProps<{
  classes: any[]
}>()
</script>

<template>
  <div class="space-y-6">
    <h3 class="text-xl font-bold text-[#2D3748] px-2 flex items-center justify-between">
      Sesi Mendatang
      <span class="text-xs font-normal text-gray-400">{{ classes.length }} Sesi</span>
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
