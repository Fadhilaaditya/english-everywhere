<script setup lang="ts">
import { Calendar, Clock, MapPin } from 'lucide-vue-next'
import { cloudinaryOptimize } from '@/utils/imageUtils'

defineProps<{
  event: any
  variant?: 'white' | 'gray'
}>()
</script>

<template>
  <div 
    class="rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex gap-5 items-start cursor-pointer hover:ring-2 transition-all"
    :class="[
      variant === 'gray' 
        ? 'bg-gray-100/50 hover:ring-gray-300/50' 
        : 'bg-white hover:ring-[#4FD1C5]/20 border border-gray-50'
    ]"
  >
    <!-- Event Image -->
    <div class="w-32 h-40 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
      <img 
        :src="cloudinaryOptimize(event.image, { width: 200, height: 250, crop: 'fill' })" 
        :alt="event.title" 
        class="w-full h-full object-cover" 
        loading="lazy"
      />
    </div>

    <!-- Content -->
    <div class="flex-1">
      <div class="flex justify-between items-start mb-2">
        <h3 
          class="font-semibold text-lg leading-tight pr-2"
          :class="variant === 'gray' ? 'text-gray-800' : 'text-gray-900'"
        >
          {{ event.title }}
        </h3>
        <span 
          class="font-bold text-lg whitespace-nowrap"
          :class="variant === 'gray' ? 'text-gray-700' : 'text-gray-900'"
        >
          {{ event.price }}
        </span>
      </div>

      <p class="text-gray-500 text-xs mb-4 line-clamp-2 font-light leading-relaxed">
        {{ event.desc }}
      </p>

      <div 
        class="flex flex-col gap-1.5 text-xs font-medium"
        :class="variant === 'gray' ? 'text-gray-500' : 'text-gray-600'"
      >
        <div class="flex items-center gap-2">
          <Calendar class="w-3.5 h-3.5" />
          <span>{{ event.date }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Clock class="w-3.5 h-3.5" />
          <span>{{ event.time }}</span>
        </div>
        <div v-if="event.location" class="flex items-center gap-2">
          <MapPin class="w-3.5 h-3.5" />
          <span>{{ event.location }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
