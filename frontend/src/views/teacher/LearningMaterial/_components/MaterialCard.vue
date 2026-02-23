<script setup lang="ts">
interface Material {
  id: number
  title: string
  description: string
  skills: string[]
  level: string
  topic: string
}

defineProps<{
  material: Material
}>()
</script>

<template>
  <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col justify-between h-full">
    <div>
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-2xl font-bold text-gray-800 leading-tight">{{ material.title }}</h2>
        <span class="text-sm font-bold text-gray-400 shrink-0 ml-4">{{ material.level }}</span>
      </div>
      <p class="text-gray-500 leading-relaxed mb-8">
        {{ material.description }}
      </p>
    </div>
    
    <div class="flex justify-between items-center mt-auto pt-4">
      <span class="px-6 py-2 bg-[#F1F3F9] text-gray-600 rounded-full text-sm font-medium">
        {{ material.skills[0] }}
      </span>
      <button class="px-8 py-2.5 bg-[#4CC9C0] hover:bg-[#3db3aa] text-white rounded-xl font-bold transition shadow-lg shadow-[#4CC9C0]/20">
        Open
      </button>
    </div>
  </div>
</template>
