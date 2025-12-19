<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

// Data (Moved from Parent)
const articles = [
  {
    id: 1,
    title: "5 Tips Seru untuk Belajar Bahasa Inggris di Rumah",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
    intro: [
      "Belajar Bahasa Inggris tidak harus selalu membosankan dengan buku tebal atau hafalan grammar. Dengan sedikit kreativitas, Anda bisa mengubah rumah menjadi sekolah Bahasa Inggris pribadi yang menyenangkan.",
      "Berikut adalah 5 tips seru dari English Everywhere agar proses belajar Anda di rumah lebih efektif dan menyenangkan:"
    ],
    sections: [
      {
        title: "1. Ubah Media Hiburan Anda Menjadi Kelas Bahasa Inggris",
        text: "Alihkan kebiasaan menonton atau mendengarkan Anda sepenuhnya ke dalam Bahasa Inggris. Ini adalah cara paling efektif untuk melatih listening skill dan memperkaya kosakata secara kontekstual."
      },
      {
        title: "2. Labeli Benda-Benda di Rumah",
        text: "Tempelkan sticky note pada benda-benda di sekitar rumah dengan nama bahasa Inggrisnya. Misalnya 'Refrigerator', 'Mirror', 'Wardrobe'. Ini membantu mengingat vocabulary sehari-hari tanpa terasa sedang belajar."
      },
      {
        title: "3. Biasakan Self-Talk dalam Bahasa Inggris",
        text: "Cobalah untuk menarasikan kegiatan Anda sehari-hari dalam bahasa Inggris. 'I am making coffee now', 'I need to find my keys'. Ini melatih kelancaran berbicara dan berpikir dalam bahasa Inggris."
      },
      {
        title: "4. Baca Buku Cerita Anak-anak",
        text: "Buku anak-anak memiliki bahasa yang sederhana dan gambar yang menarik, sangat bagus untuk pemula. Kosakatanya dasar namun esensial."
      },
      {
        title: "5. Gunakan Aplikasi Belajar Bahasa yang Interaktif",
        text: "Manfaatkan teknologi. Aplikasi seperti Duolingo atau Quizlet membuat belajar jadi seperti bermain game. Sisihkan 15 menit setiap hari untuk bermain sambil belajar."
      }
    ]
  },
  {
    id: 2,
    title: "Kapan Menggunakan 'A' dan 'An'?",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2000&auto=format&fit=crop",
    intro: [
      "Penggunaan article 'a' dan 'an' seringkali membingungkan bagi pemula. Padahal aturannya cukup sederhana jika kita memahami kuncinya: bunyi awal kata.",
      "Mari kita bahas tuntas kapan harus menggunakan 'a' dan kapan menggunakan 'an'."
    ],
    sections: [
      {
        title: "1. Gunakan 'A' untuk Bunyi Konsonan",
        text: "Gunakan 'a' sebelum kata benda tunggal yang diawali dengan bunyi konsonan. Contoh: a cat, a dog, a university (bunyi 'yu' adalah konsonan)."
      },
      {
        title: "2. Gunakan 'An' untuk Bunyi Vokal",
        text: "Gunakan 'an' sebelum kata benda tunggal yang diawali dengan bunyi vokal (a, i, u, e, o). Contoh: an apple, an egg, an hour (huruf 'h' tidak dibaca)."
      }
    ]
  },
  {
    id: 3,
    title: "Pentingnya Dongeng dalam Meningkatkan Kosakata",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2000&auto=format&fit=crop",
    intro: [
      "Mendongeng bukan hanya aktivitas pengantar tidur, tapi juga metode ampuh untuk mengajarkan bahasa Inggris kepada anak-anak.",
      "Melalui cerita, anak-anak belajar kosakata baru dalam konteks yang menyenangkan dan mudah diingat."
    ],
    sections: [
      {
        title: "1. Konteks yang Kuat",
        text: "Anak-anak lebih mudah mengingat kata ketika dikaitkan dengan alur cerita dan emosi karakter dalam dongeng."
      },
      {
        title: "2. Pengulangan Alami",
        text: "Dongeng sering menggunakan frasa yang diulang-ulang, membantu penyerapan pola kalimat secara tidak sadar."
      }
    ]
  }
]

const currentId = computed(() => Number(route.params.slug) || 1)

const article = computed(() => {
  return articles.find(a => a.id === currentId.value) ?? articles[0]
})

const goPrev = () => {
  const currentIndex = articles.findIndex(a => a.id === currentId.value)
  if (currentIndex === -1) return
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : articles.length - 1
  const prevArticle = articles[prevIndex]
  if (prevArticle) {
    router.push({ name: 'article-detail', params: { slug: prevArticle.id } })
  }
}

const goNext = () => {
  const currentIndex = articles.findIndex(a => a.id === currentId.value)
  if (currentIndex === -1) return
  const nextIndex = currentIndex < articles.length - 1 ? currentIndex + 1 : 0
  const nextArticle = articles[nextIndex]
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
