<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import EventModal from './EventModal.vue'
import EventCard from './EventCard.vue'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const isModalOpen = ref(false)
const selectedEvent = ref<any>(null)
const events = ref<any[]>([])
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const filteredEvents = computed(() => {
  if (!props.searchQuery) return events.value
  const query = props.searchQuery.toLowerCase()
  return events.value.filter(event => 
    event.title.toLowerCase().includes(query)
  )
})

const openModal = (event: any) => {
  selectedEvent.value = event
  isModalOpen.value = true
}

const fetchEvents = async () => {
    try {
        const response = await fetch(`${API_URL}/events/past`);
        if (!response.ok) throw new Error('Failed to fetch events');
        events.value = await response.json();
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

onMounted(() => {
    fetchEvents();
})
</script>

<template>
  <div class="relative z-10 mt-16">
    <h2 class="text-2xl font-normal text-gray-800 mb-8">Past Events</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <EventCard 
        v-for="event in filteredEvents" 
        :key="event.id"
        :event="event"
        variant="gray"
        @click="openModal(event)"
      />
    </div>

    <EventModal 
        :isOpen="isModalOpen" 
        :event="selectedEvent" 
        :disableRegistration="true"
        @close="isModalOpen = false" 
    />
  </div>
</template>
