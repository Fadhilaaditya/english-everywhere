<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { ref } from 'vue'
import ArticleCard from './_components/ArticleCard.vue'

// Dummy Data
import api from '@/api'
import { onMounted } from 'vue'

// Dummy Data
const articles = ref<any[]>([])

const fetchArticles = async () => {
  try {
    const response = await api.get('/articles')
    const data = response.data
    articles.value = data.articles || data
  } catch (error) {
    console.error('Error fetching articles:', error)
  }
}

onMounted(() => {
  fetchArticles()
})

const searchQuery = ref('')
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FA] relative overflow-hidden font-satoshi pb-20">
    
    <!-- Stars Decoration -->
    <div class="absolute top-20 left-10 md:left-40 animate-pulse hidden md:block">
       <!-- Teal Star SVG replaced with img -->
       <img src="/star1.svg" alt="Star Decoration" class="w-16 h-16 md:w-24 md:h-24 transform rotate-[-15deg]" />
    </div>

    <div class="absolute top-24 right-10 md:right-40 animate-bounce hidden md:block" style="animation-duration: 3s;">
       <!-- Orange Star SVG replaced with img -->
       <img src="/star2.svg" alt="Star Decoration" class="w-14 h-14 md:w-20 md:h-20 transform rotate-[15deg]" />
    </div>


    <div class="container mx-auto px-4 pt-24 md:pt-30">
      
      <!-- Header -->
      <div class="text-center mb-12 relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-wide">
          ENGLISH CORNER
        </h1>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto relative group">
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400 group-focus-within:text-[#FF9F1C] transition-colors" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="search article" 
            class="w-full bg-white py-4 pl-12 pr-6 rounded-full shadow-sm hover:shadow-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF9F1C]/20 transition-all duration-300 text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <!-- Article Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 md:px-0">
        <router-link 
          v-for="article in articles" 
          :key="article.id"
          :to="{ name: 'article-detail', params: { slug: article.id } }"
          class="block h-full cursor-pointer hover:no-underline"
        >
          <ArticleCard 
            :title="article.title"
            :description="article.description"
            :image="article.image"
          />
        </router-link>
        <!-- Duplicate for demo consistency if needed, but 3 is fine for now -->
      </div>

      <!-- Decoration Bottom (Optional) -->
       <div class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/50 to-transparent pointer-events-none"></div>

    </div>
  </div>
</template>
