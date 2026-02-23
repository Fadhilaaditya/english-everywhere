<script setup lang="ts">
import ArticleText from './_components/ArticleText.vue'
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FA] relative overflow-hidden font-satoshi pb-20 pt-4 md:pt-6">
    
    <!-- Decorations -->
    <!-- Teal Hexagon Bottom Left -->
    <div class="absolute bottom-40 -left-10 md:left-0 md:bottom-20 hidden md:block">
        <svg width="150" height="170" viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-[#52D1C6] transform -rotate-12 opacity-80">
            <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" fill="currentColor"/>
             <!-- Inner white line for style -->
            <path d="M50 5 L88 27 V73 L50 95 L12 73 V27 Z" stroke="white" stroke-width="2"/>
        </svg>
    </div>

    <!-- Orange Hexagons Right -->
    <div class="absolute top-1/3 -right-10 md:right-10 hidden md:block">
        <div class="relative w-40 h-40">
             <!-- Solid Orange -->
            <svg class="absolute top-0 right-10 text-[#FF9F1C]" width="80" height="90" viewBox="0 0 100 115" fill="currentColor">
               <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" />
            </svg>
             <!-- Outline Orange -->
            <svg class="absolute bottom-0 right-0 text-[#FF9F1C]" width="80" height="90" viewBox="0 0 100 115" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" />
            </svg>
        </div>
    </div>

    <!-- Article Content Component -->
    <ArticleText />
    
  </div>
</template>
