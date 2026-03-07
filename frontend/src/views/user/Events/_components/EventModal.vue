<script setup lang="ts">
import { Calendar, Clock, X, MapPin } from 'lucide-vue-next'
import { onUnmounted, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  event: any
  disableRegistration?: boolean
}>()

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

// Lock body scroll when modal is open
watch(() => props.isOpen, (newVal: boolean) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/30" @click="handleClose"></div>

      <div class="relative w-full max-w-[961px] bg-white rounded-[40px] shadow-2xl px-8 py-8 flex flex-col md:flex-row gap-8 max-h-[95vh] overflow-y-auto my-auto">
        
        <button @click="handleClose" class="absolute top-3 right-3 z-20 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer text-gray-500 bg-white/80 backdrop-blur-sm shadow-sm md:bg-transparent md:bg-none md:shadow-none">
          <X class="w-6 h-6" />
        </button>

        <!-- Price Badge -->
        <span class="absolute top-12 left-12 md:top-8 md:left-auto md:right-16 bg-[#52D1C6] text-white px-4 py-1.5 rounded-full text-sm md:text-base font-bold shadow-xl z-20 whitespace-nowrap transform transition-all hover:scale-105">
            {{ event?.price }} 
        </span>


        <div class="w-full md:w-[360px] flex-shrink-0">
           <img :src="event?.image" :alt="event?.title" class="w-full h-full object-cover rounded-3xl shadow-md aspect-[5/6]" />
        </div>

        <div class="flex-1 flex flex-col">
          <div class="flex items-start mb-4">
              <h2 class="text-md md:text-xl font-bold text-gray-900 leading-snug flex-1 pr-32">
                  {{ event?.title }}
              </h2>
          </div>

          <div class="text-gray-600 space-y-3 mb-6 text-base leading-relaxed flex-1">
              <p class="text-sm">Hi Ayah & Bunda! 👋</p>
              <p class="text-sm">Yuk, ajak Ananda ikut seru-seruan di Open House: {{ event?.title }}! 🏰✨</p>
              
              <div>
                  <p class="font-bold text-sm mb-1">📌 Apa aja yang bisa diikuti?</p> 
                  <ul class="space-y-0.5 text-sm list-inside pl-4"> 
                      <li>✅ Free trial class 🎓</li>
                      <li>✅ Fun activity: Building Bricks 🧱 (bisa dibawa pulang!)</li>
                      <li>✅ Kenalan lebih dekat dengan program & visi English Everywhere</li>
                  </ul>
              </div>

              <div class="pt-2">
                  <p class="text-sm">🎁 Plus... kuota terbatas, pendaftaran tutup 20 September!</p>
                  <p class="text-sm">👉 Scan barcode di poster/IG Story untuk daftar sekarang!</p>
              </div>
          </div>

          <div class="flex flex-col gap-2 pb-6 border-gray-100 mb-2">
               <div class="flex items-center gap-3 text-gray-700">
                   <Calendar class="w-5 h-5 flex-shrink-0" />
                   <span class="font-medium text-sm">{{ event?.date }}</span> 
               </div>
                <div class="flex items-center gap-3 text-gray-700">
                    <Clock class="w-5 h-5 flex-shrink-0" />
                    <span class="font-medium text-sm">{{ event?.time }}</span> 
                </div>
                <div v-if="event?.location" class="flex items-center gap-3 text-gray-700">
                    <MapPin class="w-5 h-5 flex-shrink-0" />
                    <span class="font-medium text-sm">{{ event?.location }}</span> 
                </div>
            </div>

          <button 
            :disabled="disableRegistration"
            class="w-full font-bold text-lg py-3 rounded-xl shadow-lg transition-all transform mt-auto"
            :class="[
              disableRegistration 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#52D1C6] hover:bg-[#45b8ae] text-white hover:-translate-y-0.5 cursor-pointer'
            ]"
          >
              {{ disableRegistration ? 'Registration Closed' : 'Daftar' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>