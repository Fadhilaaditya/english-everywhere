<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from 'lucide-vue-next'

interface Material {
  id: number
  title: string
  description: string
  skills: string[]
  level: string
  topic: string
}

// Data disesuaikan dengan gambar
const materials = ref<Material[]>([
  {
    id: 1,
    title: 'English Lecture',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    skills: ['Listening'],
    level: 'A1',
    topic: 'Nature'
  },
  {
    id: 2,
    title: 'English Lecture',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    skills: ['Speaking'],
    level: 'A1',
    topic: 'Food'
  },
  {
    id: 3,
    title: 'English Lecture',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    skills: ['Listening'],
    level: 'A1',
    topic: 'Hobbies'
  },
  {
    id: 4,
    title: 'English Lecture',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    skills: ['Reading'],
    level: 'A1',
    topic: 'Interest'
  }
])

const searchQuery = ref('')
const filterSkills = ref(['Speaking', 'Listening', 'Reading', 'Grammar'])
const filterTopics = ref(['Hobbies', 'Food', 'Nature', 'Interest'])
const filterLevels = ref(['Beginner (A1)', 'Intermediate (B1)', 'Advanced (C1)'])

const filteredMaterials = computed(() => {
  return materials.value.filter(item => 
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <div class="flex min-h-screen bg-[#F8F9FA] p-8 font-sans">
    <aside class="w-64 pr-8 border-r border-gray-200">
      <h2 class="text-xl font-semibold mb-6">Filters</h2>
      
      <div class="mb-8">
        <h3 class="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Skills</h3>
        <div class="space-y-3">
          <label v-for="skill in filterSkills" :key="skill" class="flex items-center group cursor-pointer">
            <input type="checkbox" class="w-5 h-5 border-2 border-gray-300 rounded text-[#4CC9C0] focus:ring-[#4CC9C0]">
            <span class="ml-3 text-gray-600 group-hover:text-black transition">{{ skill }}</span>
          </label>
        </div>
      </div>

      <div class="mb-8">
        <h3 class="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Topic</h3>
        <div class="space-y-3">
          <label v-for="topic in filterTopics" :key="topic" class="flex items-center group cursor-pointer">
            <input type="checkbox" class="w-5 h-5 border-2 border-gray-300 rounded text-[#4CC9C0] focus:ring-[#4CC9C0]">
            <span class="ml-3 text-gray-600 group-hover:text-black transition">{{ topic }}</span>
          </label>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Level</h3>
        <div class="space-y-3">
          <label v-for="level in filterLevels" :key="level" class="flex items-center group cursor-pointer">
            <input type="checkbox" class="w-5 h-5 border-2 border-gray-300 rounded text-[#4CC9C0] focus:ring-[#4CC9C0]">
            <span class="ml-3 text-gray-600 group-hover:text-black transition">{{ level }}</span>
          </label>
        </div>
      </div>
    </aside>

    <main class="flex-1 pl-8">
      <div class="flex justify-between items-center mb-10">
        <h1 class="text-2xl font-bold text-gray-800">Learning Materials</h1>
        <div class="relative w-72">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="search article" 
            class="w-full pl-10 pr-4 py-2 bg-white border-none rounded-full shadow-sm focus:ring-2 focus:ring-[#4CC9C0]/50 text-sm"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div 
          v-for="item in filteredMaterials" 
          :key="item.id"
          class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col justify-between"
        >
          <div>
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-2xl font-bold text-gray-800">{{ item.title }}</h2>
              <span class="text-sm font-bold text-gray-400">{{ item.level }}</span>
            </div>
            <p class="text-gray-500 leading-relaxed mb-8">
              {{ item.description }}
            </p>
          </div>
          
          <div class="flex justify-between items-center mt-auto">
            <span class="px-6 py-2 bg-[#F1F3F9] text-gray-600 rounded-full text-sm font-medium">
              {{ item.skills[0] }}
            </span>
            <button class="px-8 py-2.5 bg-[#4CC9C0] hover:bg-[#3db3aa] text-white rounded-xl font-bold transition shadow-lg shadow-[#4CC9C0]/20">
              Open
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredMaterials.length === 0" class="py-20 text-center text-gray-400">
        No materials found.
      </div>
    </main>
  </div>
</template>