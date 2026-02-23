<script setup lang="ts">
// No script needed
</script>

<template>
  <section class="py-16 px-6 md:px-12 bg-white">
    <div class="max-w-6xl mx-auto bg-[#FF9213] rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 L0 0 L100 0 L100 100 Z" fill="none" stroke="white" stroke-width="0.5" />
            <!-- Add more honeycomb pattern here if needed, keeping it simple for now -->
         </svg>
      </div>

      <div class="relative z-10 text-white max-w-xl">
        <h2 class="text-2xl md:text-3xl font-bold mb-2">
          Daftar dan raih kesempatan karier yang lebih baik!
        </h2>
      </div>

      <div class="relative z-10">
        <button class="bg-white text-[#FF9213] hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-colors shadow-md cursor-pointer">
          Daftar Class
        </button>
      </div>
    </div>
  </section>
</template>
