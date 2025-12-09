<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Minus } from 'lucide-vue-next'

const faqs = [
  {
    question: 'Apa saja program khusus yang ditawarkan di English Everywhere?',
    answer: 'Kami menawarkan berbagai program mulai dari Phonics untuk pemula, English for Kids, hingga persiapan tes internasional.',
    isOpen: false
  },
  {
    question: 'Bagaimana saya tahu level bahasa Inggris saya yang tepat untuk memulai?',
    answer: 'Kami menyediakan placement test gratis untuk menentukan level kemampuan bahasa Inggris Anda sebelum memulai kelas.',
    isOpen: false
  },
  {
    question: 'Bagaimana cara mendaftar kursus di English Everywhere?',
    answer: 'Anda bisa mendaftar melalui website ini dengan mengklik tombol "Daftar Kelas" atau menghubungi admin kami via WhatsApp.',
    isOpen: false
  },
  {
    question: 'Apakah kelas diadakan secara online atau tatap muka (offline)?',
    answer: 'Kami menyediakan kedua opsi tersebut. Anda bisa memilih kelas online via Zoom atau kelas offline di center kami.',
    isOpen: false
  },
  {
    question: 'Bagaimana jika saya berhalangan hadir atau tinggal masuk di salah satu sesi kelas? Apakah ada kelas pengganti?',
    answer: 'Ya, kami menyediakan sesi make-up class bagi siswa yang berhalangan hadir dengan pemberitahuan sebelumnya.',
    isOpen: false
  },
  {
    question: 'Apakah saya akan mendapatkan sertifikat setelah menyelesaikan kursus?',
    answer: 'Tentu saja! Setiap siswa yang menyelesaikan level tertentu akan mendapatkan sertifikat resmi dari English Everywhere.',
    isOpen: false
  },
  {
    question: 'Siapa saja yang bisa mengikuti kursus ini? Apakah ada batasan usia?',
    answer: 'Kursus kami terbuka untuk semua usia, mulai dari anak-anak (usia 4 tahun) hingga dewasa.',
    isOpen: false
  },
  {
    question: 'Apa yang membedakan English Everywhere dari kursus bahasa Inggris lainnya?',
    answer: 'Kami fokus pada metode pembelajaran yang interaktif, menyenangkan, dan berpusat pada praktik berbicara (speaking).',
    isOpen: false
  },
  {
    question: 'Apakah ada kelas percobaan (trial class) gratis sebelum mendaftar?',
    answer: 'Ya, kami menyediakan 1x free trial class agar Anda bisa merasakan pengalaman belajar bersama kami.',
    isOpen: false
  },
  {
    question: 'Berapa jumlah siswa dalam satu kelas?',
    answer: 'Untuk menjaga kualitas pembelajaran, kami membatasi jumlah siswa maksimal 8-10 orang per kelas.',
    isOpen: false
  },
  {
    question: 'Media pembelajaran apa saja yang akan saya dapatkan?',
    answer: 'Anda akan mendapatkan modul pembelajaran, akses ke platform e-learning, dan materi tambahan berupa video/audio.',
    isOpen: false
  },
  {
    question: 'Siapa yang bisa saya hubungi jika saya memiliki pertanyaan lebih lanjut?',
    answer: 'Anda bisa menghubungi tim customer service kami melalui WhatsApp atau email yang tertera di website.',
    isOpen: false
  }
]

const toggleFaq = (index: number) => {
  if (faqs[index]) {
    faqs[index].isOpen = !faqs[index].isOpen
  }
}
</script>

<template>
  <section class="py-16 px-6 md:px-12 bg-white relative overflow-hidden">
    <!-- Decorative Elements -->
    <div class="absolute top-10 left-10 text-green-300 opacity-60">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"></polygon></svg>
    </div>
    <div class="absolute bottom-20 right-10 text-green-300 opacity-60 rotate-45">
       <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
    </div>

    <div class="max-w-4xl mx-auto text-center mb-10">
      <h2 class="text-2xl md:text-3xl font-bold text-text-dark uppercase">
        MASIH RAGU? YUK, CARI TAHU DI SINI
      </h2>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <div v-for="(faq, index) in faqs" :key="index" class="border border-gray-200 rounded-lg overflow-hidden">
        <button 
          @click="toggleFaq(index)"
          class="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
        >
          <span class="text-sm font-medium text-text-dark pr-4">{{ faq.question }}</span>
          <component :is="faq.isOpen ? Minus : Plus" class="w-4 h-4 text-gray-400 flex-shrink-0" />
        </button>
        <div v-if="faq.isOpen" class="p-4 bg-gray-50 text-sm text-gray-600 font-poppins border-t border-gray-100">
          {{ faq.answer }}
        </div>
      </div>
    </div>
  </section>
</template>
