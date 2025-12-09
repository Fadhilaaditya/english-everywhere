<script setup lang="ts">
import { ref } from 'vue'

const activeFilter = ref('REGULAR')

const programs = [
  {
    id: 1,
    title: 'Funny Phonics',
    price: 'Mulai Rp 350.000',
    desc: 'Belajar membaca & mengeja seru dengan metode Phonics.',
    image: 'bg-yellow-200', // Placeholder color
    category: 'REGULAR'
  },
  {
    id: 2,
    title: 'Hi Kids!',
    price: 'Mulai Rp 350.000',
    desc: 'Kelas dasar anak-anak. Fokus pada Bahasa Inggris sehari-hari.',
    image: 'bg-blue-200',
    category: 'REGULAR'
  },
  {
    id: 3,
    title: 'Oxford Phonics',
    price: 'Mulai Rp 350.000',
    desc: 'Metode Phonics dari Oxford untuk membaca & menulis handal.',
    image: 'bg-green-200',
    category: 'REGULAR'
  },
  {
    id: 4,
    title: 'Abracadabra',
    price: 'Mulai Rp 350.000',
    desc: 'Program seru untuk kosakata dasar & percakapan awal.',
    image: 'bg-blue-400',
    category: 'REGULAR'
  },
  {
    id: 5,
    title: 'Get Smart',
    price: 'Mulai Rp 350.000',
    desc: 'Kurikulum dinamis, tingkatan 6 kemampuan dasar bahasa.',
    image: 'bg-pink-300',
    category: 'REGULAR'
  },
  {
    id: 6,
    title: 'Full Blast',
    price: 'Mulai Rp 350.000',
    desc: 'Program lengkap untuk siswa. Kuasai English level menengah.',
    image: 'bg-red-400',
    category: 'REGULAR'
  }
]
</script>

<template>
  <section class="py-16 px-6 md:px-12 bg-primary relative">
    <!-- Decorative Stars -->
    <div class="absolute top-10 left-5 text-white opacity-80">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    </div>
     <div class="absolute top-20 left-10 text-white opacity-60">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    </div>

    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center mb-10">
        <h2 class="text-3xl font-bold text-white mb-6 md:mb-0">OUR PROGRAMS</h2>
        
        <div class="flex gap-2">
          <button 
            @click="activeFilter = 'REGULAR'"
            :class="[
              'px-6 py-2 rounded-full font-bold text-sm transition-colors cursor-pointer',
              activeFilter === 'REGULAR' ? 'bg-white text-primary' : 'bg-transparent border border-white text-white hover:bg-white/10'
            ]"
          >
            REGULAR
          </button>
          <button 
            @click="activeFilter = 'INTENSIVE'"
            :class="[
              'px-6 py-2 rounded-full font-bold text-sm transition-colors cursor-pointer',
              activeFilter === 'INTENSIVE' ? 'bg-white text-primary' : 'bg-transparent border border-white text-white hover:bg-white/10'
            ]"
          >
            INTENSIVE
          </button>
          <button 
            @click="activeFilter = 'OTHERS'"
            :class="[
              'px-6 py-2 rounded-full font-bold text-sm transition-colors cursor-pointer',
              activeFilter === 'OTHERS' ? 'bg-white text-primary' : 'bg-transparent border border-white text-white hover:bg-white/10'
            ]"
          >
            OTHERS
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="program in programs" :key="program.id" class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <!-- Image Placeholder -->
          <div :class="['h-40 w-full flex items-center justify-center text-white font-bold text-xl', program.image]">
            {{ program.title }} Image
          </div>
          
          <div class="p-6">
            <h3 class="font-bold text-lg text-text-dark mb-1">{{ program.title }}</h3>
            <p class="text-xs text-gray-500 mb-3">{{ program.price }}</p>
            <p class="text-sm text-text-dark font-poppins">{{ program.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
