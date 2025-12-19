<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Clock } from 'lucide-vue-next'
import EventModal from './EventModal.vue'

const isModalOpen = ref(false)
const selectedEvent = ref<any>(null)

const openModal = (event: any) => {
  selectedEvent.value = event
  isModalOpen.value = true
}

const events = [
  {
    id: 1,
    title: 'Funtastic Build — Open House English Everywhere',
    date: 'January 15, 2025',
    time: '19.00 - 20.30 WIB',
    price: 'FREE',
    desc: 'A relaxed discussion about New Year goals and how to achieve them, conducted in English.',
    image: '/class1.svg', // Placeholder
    category: 'Word Play'
  },
  {
    id: 2,
    title: 'English Playdate: Cooking with Friends',
    date: 'January 15, 2025',
    time: '19.00 - 20.30 WIB',
    price: '25K',
    desc: 'A relaxed discussion about New Year goals and how to achieve them, conducted in English.',
    image: '/class2.svg', // Placeholder
    category: 'Cooking'
  },
  {
    id: 3,
    title: 'Holiday Prep: Christmas Carol Karaoke',
    date: 'January 15, 2025',
    time: '19.00 - 20.30 WIB',
    price: '25K',
    desc: 'A relaxed discussion about New Year goals and how to achieve them, conducted in English.',
    image: '/class3.svg', // Placeholder
    category: 'Music'
  },
  {
    id: 4,
    title: 'Speaking Club: New Year Resolutions',
    date: 'January 15, 2025',
    time: '19.00 - 20.30 WIB',
    price: '25K',
    desc: 'A relaxed discussion about New Year goals and how to achieve them, conducted in English.',
    image: '/class4.svg', // Placeholder
    category: 'Speaking'
  }
]
</script>

<template>
  <div class="relative z-10">
    <h2 class="text-2xl font-normal text-gray-800 mb-8">Upcoming Events</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div 
        v-for="event in events" 
        :key="event.id" 
        @click="openModal(event)"
        class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex gap-5 items-start cursor-pointer hover:ring-2 hover:ring-primary/20"
      >
         <!-- Event Image -->
         <div class="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
             <!-- Using placeholder logic or actual image if available -->
             <img :src="event.image" :alt="event.title" class="w-full h-full object-cover" />
         </div>

         <!-- Content -->
         <div class="flex-1">
             <div class="flex justify-between items-start mb-2">
                 <h3 class="font-semibold text-lg text-gray-900 leading-tight pr-2">{{ event.title }}</h3>
                 <span class="font-bold text-lg text-gray-900 whitespace-nowrap">{{ event.price }}</span>
             </div>

             <p class="text-gray-500 text-xs mb-4 line-clamp-2 md:line-clamp-none font-light leading-relaxed">
                 {{ event.desc }}
             </p>

             <div class="flex flex-col gap-1.5 text-xs text-text-dark font-medium">
                 <div class="flex items-center gap-2">
                     <Calendar class="w-3.5 h-3.5" />
                     <span>{{ event.date }}</span>
                 </div>
                 <div class="flex items-center gap-2">
                     <Clock class="w-3.5 h-3.5" />
                     <span>{{ event.time }}</span>
                 </div>
             </div>
         </div>
      </div>
    </div>

    <EventModal 
        :isOpen="isModalOpen" 
        :event="selectedEvent" 
        @close="isModalOpen = false" 
    />
  </div>
</template>
