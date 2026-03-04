<script setup lang="ts">
interface Props {
  skills: string[]
  topics: string[]
  levels: string[]
}

defineProps<Props>()

const emit = defineEmits(['update:filters'])

// Note: For now, this component uses local state for checkboxes if needed, 
// or simply acts as a stateless presentation layer if managed by parent.
</script>

<template>
  <aside class="w-64 pr-8 border-r border-gray-200">
    <h2 class="text-xl font-semibold mb-6">Filters</h2>
    
    <div class="mb-8">
      <h3 class="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Skills</h3>
      <div class="space-y-3">
        <label v-for="skill in skills" :key="skill" class="flex items-center group cursor-pointer">
          <input type="checkbox" class="w-5 h-5 border-2 border-gray-300 rounded text-[#4CC9C0] focus:ring-[#4CC9C0]">
          <span class="ml-3 text-gray-600 group-hover:text-black transition">{{ skill }}</span>
        </label>
      </div>
    </div>

    <div class="mb-8">
      <h3 class="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Topic</h3>
      <div class="space-y-3">
        <label v-for="topic in topics" :key="topic" class="flex items-center group cursor-pointer">
          <input type="checkbox" class="w-5 h-5 border-2 border-gray-300 rounded text-[#4CC9C0] focus:ring-[#4CC9C0]">
          <span class="ml-3 text-gray-600 group-hover:text-black transition">{{ topic }}</span>
        </label>
      </div>
    </div>

    <div>
      <h3 class="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Level</h3>
      <div class="space-y-3">
        <label v-for="level in levels" :key="level" class="flex items-center group cursor-pointer">
          <input type="checkbox" class="w-5 h-5 border-2 border-gray-300 rounded text-[#4CC9C0] focus:ring-[#4CC9C0]">
          <span class="ml-3 text-gray-600 group-hover:text-black transition">{{ level }}</span>
        </label>
      </div>
    </div>
  </aside>
</template>
