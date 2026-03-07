<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import EventModal from './EventModal.vue'
import Toast from '../../../../components/Toast.vue'

const events = ref<any[]>([])
const isModalOpen = ref(false)
const selectedEvent = ref(null)

// Search and Pagination State
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredEvents = computed(() => {
  if (!searchQuery.value) return events.value
  const query = searchQuery.value.toLowerCase()
  return events.value.filter(event => 
    event.title.toLowerCase().includes(query) || 
    event.location.toLowerCase().includes(query)
  )
})

const totalPages = computed(() => Math.ceil(filteredEvents.value.length / itemsPerPage))

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredEvents.value.slice(start, end)
})

// Reset to first page when searching
watch(searchQuery, () => {
    currentPage.value = 1
})

// Toast State
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
}

const fetchEvents = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/events')
    if (!response.ok) throw new Error('Failed to fetch events')
    events.value = await response.json()
  } catch (error) {
    console.error('Error fetching events:', error)
  }
}

const handleCreate = () => {
    selectedEvent.value = null
    isModalOpen.value = true
}

const handleEdit = async (event: any) => {
    try {
        const response = await fetch(`http://localhost:3001/api/events/${event.id}`)
        if (!response.ok) throw new Error('Failed to fetch event details')
        selectedEvent.value = await response.json()
        isModalOpen.value = true
    } catch (error) {
        console.error('Error fetching event details:', error)
        showNotification('Failed to load event details', 'error')
    }
}

const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
        const response = await fetch(`http://localhost:3001/api/events/${id}`, {
            method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete')
        
        await fetchEvents()
        showNotification('Event deleted successfully', 'success')
    } catch (error) {
        console.error('Error deleting event:', error)
        showNotification('Failed to delete event', 'error')
    }
}

const handleSuccess = (message: string) => {
    isModalOpen.value = false
    fetchEvents()
    showNotification(message, 'success')
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB')
}

const formatTime = (timeString: string) => {
     if (!timeString) return '-'
    // If it's a full ISO string, extract time
    if (timeString.includes('T')) {
        return new Date(timeString).toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    }
    // If it's already HH:mm or HH:mm:ss, return as is (trimmed to HH:mm)
    return timeString.substring(0, 5)
}

onMounted(() => {
    fetchEvents()
})
</script>

<template>
  <div class="bg-white rounded-lg p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 class="text-lg font-bold text-gray-900">List Events</h2>
        
        <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div class="relative w-full sm:w-80">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search by title or location..."
                    class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all text-sm"
                />
            </div>

            <button 
                @click="handleCreate"
                class="bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
            >
                Create Event
                <Plus class="w-4 h-4" />
            </button>
        </div>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full">
            <thead>
                <tr class="border-b border-gray-100 text-left">
                    <th class="py-4 px-4 font-medium text-gray-900 w-1/4">Title</th>
                    <th class="py-4 px-4 font-medium text-gray-900">Date</th>
                    <th class="py-4 px-4 font-medium text-gray-900">Time</th>
                    <th class="py-4 px-4 font-medium text-gray-900">Location</th>
                    <th class="py-4 px-4 font-medium text-gray-900 text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="event in paginatedEvents" 
                    :key="event.id"
                    class="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                    <td class="py-4 px-4 text-gray-700 font-medium">{{ event.title }}</td>
                    <td class="py-4 px-4 text-gray-700">{{ formatDate(event.date) }}</td>
                    <td class="py-4 px-4 text-gray-700">{{ formatTime(event.time) }}</td>
                    <td class="py-4 px-4 text-gray-700">{{ event.location }}</td>
                    <td class="py-4 px-4">
                        <div class="flex items-center justify-center gap-3">
                             <button 
                                @click="handleEdit(event)"
                                class="p-1.5 rounded-md text-[#4FD1C5] border border-[#4FD1C5] hover:bg-[#4FD1C5]/10 transition-colors"
                            >
                                <Pencil class="w-4 h-4" />
                            </button>
                            <button 
                                @click="handleDelete(event.id)"
                                class="p-1.5 rounded-md text-red-500 border border-red-500 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50 pt-6">
        <p class="text-sm text-gray-500">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredEvents.length) }} of {{ filteredEvents.length }} events
        </p>
        <div class="flex items-center gap-2">
            <button 
                @click="currentPage > 1 && currentPage--"
                :disabled="currentPage === 1"
                class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft class="w-4 h-4" />
            </button>
            <div class="flex items-center gap-1">
                <button 
                    v-for="page in totalPages" 
                    :key="page"
                    @click="currentPage = page"
                    class="px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all"
                    :class="currentPage === page ? 'bg-[#4FD1C5] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
                >
                    {{ page }}
                </button>
            </div>
            <button 
                @click="currentPage < totalPages && currentPage++"
                :disabled="currentPage === totalPages"
                class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight class="w-4 h-4" />
            </button>
        </div>
    </div>

    <!-- No Results -->
    <div v-if="filteredEvents.length === 0" class="py-12 text-center text-gray-500 italic">
        No events found matching "{{ searchQuery }}"
    </div>

    <!-- Modals -->
    <EventModal 
        v-if="isModalOpen"
        :is-open="isModalOpen"
        :event="selectedEvent"
        @close="isModalOpen = false"
        @success="handleSuccess"
    />

    <Toast 
        :show="showToast"
        :message="toastMessage"
        :type="toastType"
        @close="showToast = false"
    />
  </div>
</template>
