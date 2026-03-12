<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/api'

const totalArticles = ref(0)
const publishedArticles = ref(0)

const fetchArticleCount = async () => {
    try {
        const response = await api.get('/articles')
        const data = response.data
        totalArticles.value = data.length
        publishedArticles.value = data.filter((a: any) => a.status === 'published' || !a.status).length
    } catch (error) {
        console.error('Error fetching article count:', error)
    }
}

const summaryItems = computed(() => [
  { label: 'Total Articles', value: totalArticles.value.toString(), color: 'text-gray-900' },
  { label: 'Published Articles', value: publishedArticles.value.toString(), color: 'text-[#4FD1C5]' },
])

onMounted(() => {
    fetchArticleCount()
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-gray-100 rounded-2xl md:rounded-[32px] overflow-hidden mb-6 md:mb-8 shadow-sm w-full">
    <div 
      v-for="(item, index) in summaryItems" 
      :key="item.label"
      class="p-4 md:p-8 flex flex-col gap-1 md:gap-2 relative"
      :class="[
        index < summaryItems.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-gray-100' : '',
        index === 1 ? 'sm:border-r-0 lg:border-r border-gray-100' : ''
      ]"
    >
      <span class="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">{{ item.label }}</span>
      <span class="text-2xl md:text-4xl font-bold" :class="item.color">{{ item.value }}</span>
    </div>
  </div>
</template>
