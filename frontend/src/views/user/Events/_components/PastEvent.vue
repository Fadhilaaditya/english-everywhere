<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import EventModal from './EventModal.vue'
import EventCard from './EventCard.vue'
import api from '@/api'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const isModalOpen = ref(false)
const selectedEvent = ref<any>(null)
const events = ref<any[]>([])

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
        const response = await api.get('/events/past');
        events.value = response.data;
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
