  <script setup lang="ts">
  import { ref } from 'vue'
  import { Plus, Minus } from 'lucide-vue-next'

  // Bungkus array dengan ref() agar menjadi reaktif
  const faqs = ref([
    {
      question: 'Apa saja program khusus yang ditawarkan di English Everywhere?',
      answer: 'Kami menawarkan berbagai program mulai dari Phonics untuk pemula, English for Kids, adults, professionals, hingga persiapan tes internasional.',
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
      answer: 'Kami menyediakan kedua opsi tersebut. Anda bisa memilih kelas online via Zoom atau kelas offline di center kami, dan home visit.',
      isOpen: false
    },
    {
      question: 'Apakah saya akan mendapatkan sertifikat setelah menyelesaikan kursus?',
      answer: 'Tentu saja! Setiap siswa yang menyelesaikan level tertentu akan mendapatkan sertifikat resmi dari English Everywhere.',
      isOpen: false
    },
    {
      question: 'Siapa saja yang bisa mengikuti kursus ini? Apakah ada batasan usia?',
      answer: 'Kursus kami terbuka untuk semua usia, mulai dari anak-anak (usia 2,5 tahun) hingga usia dewasa.',
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
      answer: 'Anda akan mendapatkan modul pembelajaran, interactive whiteboard, dan materi tambahan berupa video/audio.',
      isOpen: false
    },
    {
      question: 'Siapa yang bisa saya hubungi jika saya memiliki pertanyaan lebih lanjut?',
      answer: 'Anda bisa menghubungi tim customer service kami melalui WhatsApp atau email yang tertera di website.',
      isOpen: false
    }
  ])

  const toggleFaq = (index: number) => {
    // Tambahkan .value karena faqs sekarang adalah sebuah ref
    if (faqs.value[index]) {
      faqs.value[index].isOpen = !faqs.value[index].isOpen
    }
  }
  </script>

  <template>
    <section class="pt-16 pb-44 md:py-16 px-6 md:px-12 bg-white relative overflow-hidden">
      <!-- Decorations -->
      <img src="/1.%20EEV%20Lebaran%20-%20Leo%201.png" alt="Decoration Leo" class="absolute bottom-0 -left-3 md:-left-20 lg:-left-8 xl:left-0 w-36 md:w-56 opacity-80 z-0 pointer-events-none" />
      <img src="/4.%20EEV%20Lebaran%20-%20Kin%201.png" alt="Kin" class="absolute top-10 right-0 md:right-4 w-24 md:w-44 z-0 pointer-events-none" />

      <div class="max-w-4xl mx-auto text-center mb-10 relative z-10">
        <h2 class="text-2xl md:text-3xl font-bold text-text-dark uppercase">
          MASIH RAGU? YUK, CARI TAHU DI SINI
        </h2>
      </div>

      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 relative z-10">
        <div v-for="(faq, index) in faqs" :key="index" class="border border-gray-200 rounded-lg overflow-hidden h-fit">
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