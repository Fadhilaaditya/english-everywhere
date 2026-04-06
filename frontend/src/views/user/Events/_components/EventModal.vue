<script setup lang="ts">
import { Calendar, Clock, X, MapPin, Image as ImageIcon } from 'lucide-vue-next'
import { onUnmounted, watch, computed } from 'vue'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const props = defineProps<{
  isOpen: boolean
  event: any
  disableRegistration?: boolean
}>()

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const eventImages = computed(() => {
    if (props.event?.images && Array.isArray(props.event.images) && props.event.images.length > 0) {
        return props.event.images
    }
    return props.event?.image ? [props.event.image] : []
})

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

        <!-- Image Carousel -->
        <div class="w-full md:w-[360px] flex-shrink-0 relative">
           <swiper
                v-if="eventImages.length > 0"
                :modules="[Pagination, Navigation, Autoplay]"
                :slides-per-view="1"
                :pagination="{ clickable: true }"
                :navigation="eventImages.length > 1"
                :autoplay="{ delay: 3000, disableOnInteraction: false }"
                class="w-full h-full rounded-3xl shadow-md aspect-[5/6] overflow-hidden"
           >
                <swiper-slide v-for="(img, index) in eventImages" :key="index">
                    <img :src="img" :alt="event?.title" class="w-full h-full object-cover" />
                </swiper-slide>
           </swiper>
           <div v-else class="w-full h-full bg-gray-100 rounded-3xl flex items-center justify-center aspect-[5/6]">
               <ImageIcon class="w-12 h-12 text-gray-300" />
           </div>
        </div>

        <div class="flex-1 flex flex-col">
          <div class="flex items-start mb-4">
              <h2 class="text-md md:text-xl font-bold text-gray-900 leading-snug flex-1 pr-32">
                  {{ event?.title }}
              </h2>
          </div>

          <div class="text-gray-600 space-y-3 mb-6 text-base leading-relaxed flex-1">
              <div class="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-poppins">
                  {{ event?.desc }}
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

<style scoped>
/* Swiper Customization */
:deep(.swiper-pagination-bullet-active) {
    background: #52D1C6 !important;
}
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    color: #52D1C6 !important;
    background: white !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
}
:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
    font-size: 14px !important;
    font-weight: bold !important;
}
</style>