<script setup lang="ts">
import { ref, onMounted } from 'vue'

const totalArticles = ref(0)

const fetchArticleCount = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/articles')
        if (!response.ok) throw new Error('Failed to fetch articles')
        const data = await response.json()
        totalArticles.value = data.length
    } catch (error) {
        console.error('Error fetching article count:', error)
    }
}

onMounted(() => {
    fetchArticleCount()
})
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-900 p-6 w-64 shadow-sm mb-8">
    <h3 class="text-gray-500 text-sm font-medium mb-2">Total Article</h3>
    <p class="text-3xl font-bold text-gray-900">{{ totalArticles }}</p>
  </div>
</template>
