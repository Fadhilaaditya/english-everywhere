<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight, Star } from 'lucide-vue-next'

const testimonials = [
  {
    id: 1,
    name: 'Ibu Dita',
    role: 'Orang Tua Murid',
    quote: 'Percaya Diri Bahasa Inggris Yang Tumbuh Pesat.',
    text: 'Dulu anak saya malu-malu kalau disuruh bicara bahasa Inggris, takut salah. Setelah ikut English Everywhere, dia jadi berani banget! Sekarang dia sering tiba-tiba menyanyi lagu bahasa Inggris. Metode belajarnya seru, jadi dia tidak merasa tertekan.',
    rating: 5
  },
  {
    id: 2,
    name: 'Bpk Rendi',
    role: 'Orang Tua Murid',
    quote: 'Belajar Seru, Kemampuan Meningkat Drastis!',
    text: 'Saya suka cara pengajarannya yang interaktif. Anak saya tidak merasa sedang belajar, tapi seperti sedang bermain. Tutornya sabar dan kreatif. Hasilnya, nilai bahasa Inggris di sekolah meningkat drastis, dan yang paling penting, dia jadi suka bahasa Inggris.',
    rating: 5
  }
]

const activeIndex = ref(0)

const nextSlide = () => {
  activeIndex.value = (activeIndex.value + 1) % testimonials.length
}

const prevSlide = () => {
  activeIndex.value = (activeIndex.value - 1 + testimonials.length) % testimonials.length
}
</script>

<template>
  <section class="py-16 px-6 md:px-12 bg-white relative">
    <div class="max-w-6xl mx-auto relative">
      <!-- Navigation Buttons -->
      <button 
        @click="prevSlide"
        class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white shadow-md rounded-full p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>
      
      <button 
        @click="nextSlide"
        class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white shadow-md rounded-full p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
      >
        <ChevronRight class="w-6 h-6" />
      </button>

      <!-- Carousel Content -->
      <div class="overflow-hidden">
        <div 
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
        >
          <div 
            v-for="testimonial in testimonials" 
            :key="testimonial.id"
            class="w-full flex-shrink-0 px-4"
          >
            <div class="bg-white border border-orange-200 rounded-xl p-8 md:p-12 shadow-sm max-w-3xl mx-auto">
              <h3 class="text-xl md:text-2xl font-bold text-primary mb-4">
                {{ testimonial.quote }}
              </h3>
              <p class="text-text-dark font-poppins mb-6 leading-relaxed">
                {{ testimonial.text }}
              </p>
              
              <div class="flex items-center gap-4 border-t border-gray-100 pt-6">
                <div class="flex text-yellow-400">
                  <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-current" />
                </div>
                <div class="font-bold text-sm text-text-dark">
                  {{ testimonial.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
