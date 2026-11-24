<script setup lang="ts">
import { Calendar, Clock, X, MapPin, Image as ImageIcon } from 'lucide-vue-next'
import { onUnmounted, watch, computed, ref } from 'vue'
import { cloudinaryOptimize } from '@/utils/imageUtils'
import api from '@/api'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

interface EventDetail {
  id: number
  title: string
  price?: string | null
  desc?: string | null
  date?: string | null
  time?: string | null
  location?: string | null
  image?: string | null
  images?: string[] | null
}

const props = defineProps<{
  isOpen: boolean
  event: EventDetail | null
  disableRegistration?: boolean
}>()

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const detail = ref<EventDetail | null>(null)
const loadingDetail = ref(false)
const detailError = ref(false)
const failedImages = ref<Set<string>>(new Set())
let detailRequest: AbortController | null = null
const displayEvent = computed(() => detail.value ?? props.event)

const eventImages = computed(() => {
    const event = displayEvent.value
    const images = Array.isArray(event?.images) ? event.images.filter((image): image is string => typeof image === 'string' && image.trim().length > 0) : []
    if (event?.image && !images.includes(event.image)) images.unshift(event.image)
    return images
})

const fetchEventDetail = async () => {
  if (!props.isOpen || !props.event?.id) return
  detailRequest?.abort()
  const request = new AbortController()
  detailRequest = request
  loadingDetail.value = true
  detailError.value = false
  try {
    const response = await api.get<EventDetail>(`/events/${props.event.id}`, { signal: request.signal })
    if (!request.signal.aborted) detail.value = response.data
  } catch (error) {
    if (!request.signal.aborted) {
      detailError.value = true
      console.error('Error fetching event details:', error)
    }
  } finally {
    if (detailRequest === request) {
      detailRequest = null
      loadingDetail.value = false
    }
  }
}

watch([() => props.isOpen, () => props.event?.id], ([open]) => {
  detailRequest?.abort()
  detailRequest = null
  detail.value = null
  loadingDetail.value = false
  detailError.value = false
  failedImages.value = new Set()
  if (open) void fetchEventDetail()
}, { immediate: true })

const markImageFailed = (image: string) => {
  failedImages.value = new Set([...failedImages.value, image])
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
  detailRequest?.abort()
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/30" @click="handleClose"></div>

      <div class="relative w-full max-w-[961px] bg-white rounded-[40px] shadow-2xl px-8 py-8 flex flex-col md:flex-row gap-8 max-h-[95vh] overflow-y-auto my-auto">
        
        <button aria-label="Close event details" @click="handleClose" class="absolute top-3 right-3 z-20 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer text-gray-500 bg-white/80 backdrop-blur-sm shadow-sm md:bg-transparent md:bg-none md:shadow-none">
          <X class="w-6 h-6" />
        </button>

        <!-- Price Badge -->
        <span class="absolute top-12 left-12 md:top-8 md:left-auto md:right-16 bg-[#52D1C6] text-white px-4 py-1.5 rounded-full text-sm md:text-base font-bold shadow-xl z-20 whitespace-nowrap transform transition-all hover:scale-105">
            {{ displayEvent?.price }}
        </span>

        <!-- Image Carousel -->
        <div class="w-full md:w-[360px] flex-shrink-0 relative">
           <swiper
                v-if="eventImages.length > 0"
                :key="`${displayEvent?.id}-${eventImages.length}`"
                :modules="[Pagination, Navigation, A11y]"
                :slides-per-view="1"
                :pagination="eventImages.length > 1 ? { clickable: true } : false"
                :navigation="eventImages.length > 1"
                :a11y="{ prevSlideMessage: 'Previous photo', nextSlideMessage: 'Next photo' }"
                class="w-full h-full rounded-3xl shadow-md aspect-[5/6] overflow-hidden"
           >
                <swiper-slide v-for="(img, index) in eventImages" :key="index">
                    <img 
                      v-if="!failedImages.has(img)"
                      :src="cloudinaryOptimize(img, { width: 600, height: 720, crop: 'fill' })" 
                      :alt="`${displayEvent?.title || 'Event'} - photo ${index + 1} of ${eventImages.length}`"
                      class="w-full h-full object-cover" 
                      :loading="index === 0 ? 'eager' : 'lazy'"
                      decoding="async"
                      @error="markImageFailed(img)"
                    />
                    <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center text-sm text-gray-500">Image unavailable</div>
                </swiper-slide>
           </swiper>
           <div v-else class="w-full h-full bg-gray-100 rounded-3xl flex items-center justify-center aspect-[5/6]">
               <ImageIcon class="w-12 h-12 text-gray-300" />
           </div>
        </div>

        <div class="flex-1 flex flex-col">
          <div class="flex items-start mb-4">
              <h2 class="text-md md:text-xl font-bold text-gray-900 leading-snug flex-1 pr-32">
                  {{ displayEvent?.title }}
              </h2>
          </div>

          <div class="text-gray-600 space-y-3 mb-6 text-base leading-relaxed flex-1">
              <div class="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-poppins">
                  <p v-if="loadingDetail" role="status">Loading event details...</p>
                  <p v-else-if="detailError" role="alert">Failed to load event details. <button class="underline" @click="fetchEventDetail">Try again</button></p>
                  <template v-else>{{ displayEvent?.desc }}</template>
              </div>
          </div>

          <div class="flex flex-col gap-2 pb-6 border-gray-100 mb-2">
               <div class="flex items-center gap-3 text-gray-700">
                   <Calendar class="w-5 h-5 flex-shrink-0" />
                   <span class="font-medium text-sm">{{ displayEvent?.date }}</span>
               </div>
                <div class="flex items-center gap-3 text-gray-700">
                    <Clock class="w-5 h-5 flex-shrink-0" />
                    <span class="font-medium text-sm">{{ displayEvent?.time }}</span>
                </div>
                <div v-if="displayEvent?.location" class="flex items-center gap-3 text-gray-700">
                    <MapPin class="w-5 h-5 flex-shrink-0" />
                    <span class="font-medium text-sm">{{ displayEvent?.location }}</span>
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
