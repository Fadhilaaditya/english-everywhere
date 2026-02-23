<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from 'lucide-vue-next'
import MaterialFilter from './_components/MaterialFilter.vue'
import MaterialCard from './_components/MaterialCard.vue'

interface Material {
  id: number
  title: string
  description: string
  skills: string[]
  level: string
  topic: string
}

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
    <MaterialFilter 
      :skills="filterSkills"
      :topics="filterTopics"
      :levels="filterLevels"
    />

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

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
        <MaterialCard
          v-for="item in filteredMaterials"
          :key="item.id"
          :material="item"
        />
      </div>

      <div v-if="filteredMaterials.length === 0" class="py-20 text-center text-gray-400">
        No materials found.
      </div>
    </main>
  </div>
</template>
