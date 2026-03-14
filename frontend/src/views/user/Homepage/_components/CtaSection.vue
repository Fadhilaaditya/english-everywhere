<script setup lang="ts">
// No script needed
</script>

<template>
  <section class="py-16 px-6 md:px-12 bg-white">
    <div class="max-w-6xl mx-auto bg-[#FF9213] rounded-2xl p-8 md:px-12 md:py-10 relative shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 pl-8 md:pl-56 mt-10">
      
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 right-0 h-full w-1/3 opacity-20 pointer-events-none overflow-hidden rounded-r-2xl">
         <img src="/hex.svg" alt="hexagon pattern" class="absolute -right-10 -top-10 w-64 h-64 object-cover" />
      </div>

      <!-- Dira Image - absolutely positioned relative to the wrapper -->
      <img src="/2.%20EEV%20Lebaran%20-%20Dira%201.png" alt="Student Dira" class="absolute -bottom-6 -left-6 md:-left-10 w-38 md:w-64 z-20 pointer-events-none drop-shadow-lg" />

      <div class="relative z-10 text-white max-w-xl">
        <h2 class="text-2xl md:text-3xl md:text-left text-center font-bold mb-2">
          Daftar dan raih kesempatan karier yang lebih baik!
        </h2>
      </div>

      <div class="relative z-10">
        <a href="#programs" class="inline-block bg-white text-[#FF9213] hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-colors shadow-md cursor-pointer whitespace-nowrap">
          Browse Class
        </a>
      </div>
    </div>
  </section>
</template>
