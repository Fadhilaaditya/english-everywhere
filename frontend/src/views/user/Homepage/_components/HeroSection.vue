<script setup lang="ts">
// No script needed for now
</script>

<template>
  <section class="relative bg-white pt-10 pb-20 px-6 md:px-12 overflow-hidden">
    <!-- Decorative Elements (Sun, Squiggles) -->
    <div class="absolute top-10 left-10 opacity-80 animate-spin-slow">
      <!-- Custom Sun Icon -->
      <img src="/sun.svg" alt="Sun" class="w-24 h-24 md:w-32 md:h-32" />
    </div>
    <div class="absolute top-20 right-20 text-secondary opacity-60">
      <!-- Squiggle Placeholder -->
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
    </div>

    <div class="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
      <h1 class="text-4xl md:text-6xl font-bold text-text-dark mb-4 leading-tight">
        EMBRACE YOUR <br />
        FUTURE WITH US
      </h1>
      <p class="text-text-dark text-lg md:text-xl max-w-2xl mb-8 font-poppins">
        Our fun and interactive courses are designed for kids to learn English confidently, anytime and anywhere.
      </p>
      
      <button class="bg-secondary hover:bg-teal-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105 cursor-pointer">
        Grow With Us
      </button>
    </div>

    <!-- Illustrations -->
    <div class="mt-12 flex flex-col md:flex-row justify-between items-end gap-8 max-w-6xl mx-auto">
      <!-- Left Illustration (Boy raising hand) -->
      <div class="w-full md:w-1/3 flex justify-center">
        <div class="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
          Boy Illustration
        </div>
      </div>

      <!-- Right Illustration (Boy reading) -->
      <div class="w-full md:w-1/3 flex justify-center">
        <div class="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
          Reading Illustration
        </div>
      </div>
    </div>
  </section>
</template>
