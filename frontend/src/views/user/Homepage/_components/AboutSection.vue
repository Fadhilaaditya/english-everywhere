<script setup lang="ts">
import { Hexagon } from 'lucide-vue-next'
</script>

<template>
  <section class="py-16 px-6 md:px-12 bg-white relative overflow-hidden">
    <!-- Decorative Honeycomb (Top Right) -->
    <div class="absolute top-0 right-0 p-4 flex gap-2 opacity-80">
      <Hexagon class="text-primary w-12 h-12 fill-current" />
      <Hexagon class="text-secondary w-10 h-10 fill-current mt-8" />
    </div>

    <!-- Decorative Star (Bottom Left) -->
    <div class="absolute bottom-10 left-10 text-primary">
       <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    </div>

    <div class="max-w-4xl mx-auto">
      <h3 class="text-accent font-bold text-lg mb-2 uppercase tracking-wide">About Us</h3>
      <h2 class="text-3xl md:text-4xl font-bold text-text-dark mb-4">
        LET'S SPEAK ENGLISH EVERYWHERE!
      </h2>
      <p class="text-text-dark mb-8 font-medium">
        Karena dunia dimulai dari keberanian untuk berbicara
      </p>

      <p class="text-text-dark leading-relaxed font-poppins text-justify">
        Di English Everywhere, kami meyakini bahwa penguasaan bahasa Inggris membuka akses menuju dunia yang lebih luas. Melalui teknologi terkini dan metode pembelajaran yang komunikatif, kami menciptakan pengalaman belajar yang hidup, relevan, dan membangkitkan antusiasme. Setiap peserta dibimbing untuk berani mengekspresikan diri, baik dalam percakapan santai maupun konteks profesional. Lebih dari sekadar mengajarkan bahasa, kami menanamkan kepercayaan diri, menumbuhkan potensi, dan menyiapkan generasi yang siap bersaing secara global.
      </p>
    </div>
  </section>
</template>
