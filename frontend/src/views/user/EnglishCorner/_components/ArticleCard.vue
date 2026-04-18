<script setup lang="ts">
import { cloudinaryOptimize } from '@/utils/imageUtils'

defineProps<{
  title: string
  description: string
  image: string
}>()
</script>

<template>
  <div class="bg-white rounded-3xl p-4 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
    <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
      <img 
        :src="cloudinaryOptimize(image, { width: 400, height: 300, crop: 'fill' })" 
        :alt="title" 
        class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
        loading="lazy"
      />
    </div>
    
    <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3 leading-snug">
      {{ title }}
    </h3>
    
    <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">
      {{ description }}
    </p>
  </div>
</template>
