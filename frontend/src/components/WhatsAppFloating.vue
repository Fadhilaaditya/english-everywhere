<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'

const phoneNumber = '628997626888'
const message = 'Hello, I would like to ask about English Everywhere.'
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
</script>

<template>
  <a 
    :href="whatsappUrl" 
    target="_blank" 
    rel="noopener noreferrer"
    class="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-110 active:scale-95 transition-all duration-300 group"
    aria-label="Contact us on WhatsApp"
  >
    <MessageCircle class="w-7 h-7" />
    
    <!-- Tooltip -->
    <span class="absolute right-16 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-gray-100">
      Hubungi Kami
    </span>

    <!-- Pulse Effect -->
    <span class="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10 group-hover:hidden"></span>
  </a>
</template>

<style scoped>
@keyframes ping {
  75%, 100% {
    transform: scale(1.6);
    opacity: 0;
  }
}
.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
