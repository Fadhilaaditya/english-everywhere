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
    title: 'Spelling Bee Challenge 2025',
    date: 'January 15, 2025',
    time: '19.00 - 20.30 WIB',
    price: '25K',
    desc: 'A relaxed discussion about New Year goals and how to achieve them, conducted in English.',
    image: '/class1.svg',
    category: 'Competition'
  },
  {
    id: 2,
    title: 'Grammar Clinic: Present Tenses Mastery',
    date: 'February 27, 2025',
    time: '14.00 - 16.00 WIB',
    price: 'Free',
    desc: 'An intensive workshop focusing on the usage of the three main present tenses that often cause confusion.',
    image: '/class2.svg',
    category: 'Workshop'
  },
  {
    id: 3,
    title: 'TOEFL Simulation Test',
    date: 'March 10, 2025',
    time: '09.00 - 12.00 WIB',
    price: '75K',
    desc: 'A complete ITP TOEFL simulation exam to measure participants\' readiness.',
    image: '/class3.svg',
    category: 'Exam'
  },
  {
    id: 4,
    title: 'English Movie Night: "The King\'s Speech"',
    date: 'March 22, 2025',
    time: '19.30 - 21.30 WIB',
    price: '35K',
    desc: 'A movie screening to practice listening skills, followed by a short discussion.',
    image: '/class4.svg',
    category: 'Entertainment'
  },
  {
    id: 5,
    title: 'IELTS Speaking Practice with Native Speaker',
    date: 'May 5, 2025',
    time: '10.00 - 12.00 WIB',
    price: '100K',
    desc: 'An intensive speaking practice session with a native speaker for IELTS test preparation.',
    image: '/class1.svg',
    category: 'Practice'
  },
  {
    id: 6,
    title: 'Vocabulary Booster: Travel & Culture',
    date: 'June 25, 2025',
    time: '19.00 - 21.00 WIB',
    price: '40K',
    desc: 'Learning specific vocabulary needed when traveling and interacting with other cultures.',
    image: '/class2.svg',
    category: 'Workshop'
  }
]
</script>

<template>
  <div class="relative z-10 mt-16">
    <h2 class="text-2xl font-normal text-gray-800 mb-8">Past Events</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div 
        v-for="event in events" 
        :key="event.id" 
        @click="openModal(event)"
        class="bg-gray-100/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex gap-5 items-start cursor-pointer hover:ring-2 hover:ring-gray-300/50"
      >
         <!-- Event Image -->
         <div class="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
             <img :src="event.image" :alt="event.title" class="w-full h-full object-cover" />
         </div>

         <!-- Content -->
         <div class="flex-1">
             <div class="flex justify-between items-start mb-2">
                 <h3 class="font-semibold text-lg text-gray-800 leading-tight pr-2">{{ event.title }}</h3>
                 <span class="font-bold text-lg text-gray-700 whitespace-nowrap">{{ event.price }}</span>
             </div>

             <p class="text-gray-500 text-xs mb-4 line-clamp-2 md:line-clamp-none font-light leading-relaxed">
                 {{ event.desc }}
             </p>

             <div class="flex flex-col gap-1.5 text-xs text-gray-500 font-medium">
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
