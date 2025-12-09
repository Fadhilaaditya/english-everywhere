<script setup lang="ts">
import { Youtube, Instagram, ShoppingBag, Phone } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-white pt-16 pb-8 px-6 md:px-12 border-t border-gray-100">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      <!-- Brand Column -->
      <div class="col-span-1 md:col-span-2">
        <div class="flex items-center gap-2 mb-4">
           <!-- Logo Placeholder -->
           <span class="text-secondary font-quicksand font-bold text-2xl">English Everywhere</span>
        </div>
        <p class="text-text-dark font-medium mb-4">Embrace Your Future With Us!</p>
        <div class="flex gap-4 text-xs text-gray-500">
          <span>#EnglishCourses</span>
          <span>#KosaKataInggris</span>
          <span>#SpeakingWithConfidence</span>
        </div>
      </div>

      <!-- Features Column -->
      <div>
        <h4 class="font-bold text-text-dark mb-4">Features</h4>
        <ul class="space-y-2 text-sm text-gray-600 font-poppins">
          <li><a href="#" class="hover:text-primary transition-colors">Homepage</a></li>
          <li><a href="#" class="hover:text-primary transition-colors">About Us</a></li>
          <li><a href="#" class="hover:text-primary transition-colors">Daftar Kelas</a></li>
          <li><a href="#" class="hover:text-primary transition-colors">Events</a></li>
          <li><a href="#" class="hover:text-primary transition-colors">English Corner</a></li>
        </ul>
      </div>

      <!-- Contact Column -->
      <div>
        <h4 class="font-bold text-text-dark mb-4">Contact</h4>
        <div class="space-y-4 text-sm text-gray-600 font-poppins">
          <div>
            <p class="font-medium text-text-dark">Address:</p>
            <p>Cendana Residence Blok H7 No 5,</p>
            <p>South Tangerang 15416</p>
          </div>
          <div>
            <p class="font-medium text-text-dark">Phone number:</p>
            <p>+62 812 8888 340</p>
          </div>
          <div>
            <p class="font-medium text-text-dark mb-2">Social Media:</p>
            <div class="flex gap-4">
              <a href="#" class="text-text-dark hover:text-primary transition-colors"><Youtube class="w-5 h-5" /></a>
              <a href="#" class="text-text-dark hover:text-primary transition-colors"><Instagram class="w-5 h-5" /></a>
              <a href="#" class="text-text-dark hover:text-primary transition-colors"><ShoppingBag class="w-5 h-5" /></a>
              <a href="#" class="text-text-dark hover:text-primary transition-colors"><Phone class="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-100 pt-8 text-center text-xs text-gray-400 font-poppins">
      © 2025 English Everywhere Ltd. All Rights Reserved.
    </div>
  </footer>
</template>
