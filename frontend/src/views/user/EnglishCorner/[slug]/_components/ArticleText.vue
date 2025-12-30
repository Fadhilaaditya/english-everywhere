<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()

const articles = ref<any[]>([])

const fetchArticles = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/articles')
    if (!response.ok) throw new Error('Failed to fetch articles')
    const data = await response.json()
    
    // Ensure JSON fields are parsed (handling potential stringified data from DB)
    articles.value = data.map((article: any) => ({
      ...article,
      intro: typeof article.intro === 'string' ? JSON.parse(article.intro) : article.intro,
      sections: typeof article.sections === 'string' ? JSON.parse(article.sections) : article.sections
    }))
  } catch (error) {
    console.error('Error fetching articles:', error)
  }
}

onMounted(() => {
    fetchArticles()
})

const currentId = computed(() => Number(route.params.slug) || 1)

const article = computed(() => {
  return articles.value.find((a: any) => a.id === currentId.value) ?? articles.value[0]
})

const goPrev = () => {
  const currentIndex = articles.value.findIndex((a: any) => a.id === currentId.value)
  if (currentIndex === -1) return
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : articles.value.length - 1
  const prevArticle = articles.value[prevIndex]
  if (prevArticle) {
    router.push({ name: 'article-detail', params: { slug: prevArticle.id } })
  }
}

const goNext = () => {
  const currentIndex = articles.value.findIndex((a: any) => a.id === currentId.value)
  if (currentIndex === -1) return
  const nextIndex = currentIndex < articles.value.length - 1 ? currentIndex + 1 : 0
  const nextArticle = articles.value[nextIndex]
  if (nextArticle) {
    router.push({ name: 'article-detail', params: { slug: nextArticle.id } })
  }
}
</script>

<template>
    <div class="container mx-auto px-4 max-w-4xl relative z-10">
      
      <!-- Navigation Buttons -->
      <div class="flex justify-between items-center mb-8">
        <button @click="goPrev" class="w-10 h-10 md:w-12 md:h-12 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group" title="Previous Article">
          <ChevronLeft class="w-6 h-6 text-gray-600 group-hover:text-primary" />
        </button>
        <button @click="goNext" class="w-10 h-10 md:w-12 md:h-12 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group" title="Next Article">
          <ChevronRight class="w-6 h-6 text-gray-600 group-hover:text-primary" />
        </button>
      </div>

      <!-- Title -->
      <h1 class="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-12 leading-tight">
        {{ article?.title }}
      </h1>

      <!-- Featured Image -->
      <div class="w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-lg mb-12">
        <img :src="article?.image" alt="Article Image" class="w-full h-full object-cover" />
      </div>

      <!-- Main Text Content -->
      <div class="prose prose-lg max-w-none text-gray-700 font-satoshi">
        <p v-for="(paragraph, idx) in article?.intro" :key="idx" class="mb-6 leading-relaxed">
          {{ paragraph }}
        </p>

        <div v-for="(section, index) in article?.sections" :key="index" class="mb-8">
          <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">{{ section.title }}</h3>
          <p class="leading-relaxed">{{ section.text }}</p>
        </div>
      </div>

    </div>
</template>
