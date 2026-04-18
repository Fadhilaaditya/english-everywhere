<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { cloudinaryOptimize } from '@/utils/imageUtils'

const router = useRouter()
const route = useRoute()

const article = ref<any>(null)
import api from '@/api'

const fetchArticle = async () => {
  try {
    const slug = route.params.slug
    const response = await api.get(`/articles/${slug}`)
    const data = response.data
    
    // Ensure JSON fields are parsed (handling potential stringified data from DB)
    article.value = {
      ...data,
      intro: typeof data.intro === 'string' ? JSON.parse(data.intro) : data.intro,
      sections: typeof data.sections === 'string' ? JSON.parse(data.sections) : data.sections
    }
  } catch (error) {
    console.error('Error fetching article:', error)
  }
}

onMounted(() => {
    fetchArticle()
})

const goBack = () => {
  router.push('/english-corner')
}
</script>

<template>
    <div class="container mx-auto px-4 max-w-4xl relative z-10">
      
      <!-- Navigation Buttons -->
      <div class="flex items-center mb-8">
        <button @click="goBack" class="flex items-center gap-2 text-gray-500 hover:text-[#4FD1C5] font-medium transition-colors cursor-pointer group">
          <ChevronLeft class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Articles</span>
        </button>
      </div>

      <!-- Title -->
      <h1 class="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-12 leading-tight">
        {{ article?.title }}
      </h1>

      <!-- Featured Image -->
      <div class="w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-lg mb-12">
        <img 
          :src="cloudinaryOptimize(article?.image, { width: 1000 })" 
          alt="Article Image" 
          class="w-full h-full object-cover" 
        />
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
