<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import EventModal from './EventModal.vue'
import Toast from '../../../../components/Toast.vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
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
    (event.title?.toLowerCase() || '').includes(query) || 
    (event.location?.toLowerCase() || '').includes(query)
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
    const response = await fetch(`${API_URL}/events`)
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
        const response = await fetch(`${API_URL}/events/${event.id}`)
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
        const response = await fetch(`${API_URL}/events/${id}`, {
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
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
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
  <div class="bg-white rounded-2xl md:rounded-[32px] p-4 md:p-8 border border-gray-50 shadow-sm">
    <div class="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6 md:mb-8">
        <h2 class="text-xl font-bold text-gray-900">List Events</h2>
        
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div class="relative w-full sm:w-64 lg:w-80">
                <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search event..."
                    class="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/20 focus:border-[#4FD1C5] transition-all text-sm"
                />
            </div>

            <button 
                @click="handleCreate"
                class="bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#4FD1C5]/20 w-full sm:w-auto justify-center"
            >
                <Plus class="w-4 h-4" />
                Create Event
            </button>
        </div>
    </div>

    <div class="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <table class="w-full min-w-[800px]">
            <thead>
                <tr class="text-left border-b border-gray-50">
                    <th class="pb-4 px-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Title</th>
                    <th class="pb-4 px-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Date</th>
                    <th class="pb-4 px-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Time</th>
                    <th class="pb-4 px-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Location</th>
                    <th class="pb-4 px-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider text-center">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                <tr 
                    v-for="event in paginatedEvents" 
                    :key="event.id"
                    class="group hover:bg-gray-50/50 transition-colors"
                >
                    <td class="py-5 px-4 text-sm font-medium text-gray-900">{{ event.title }}</td>
                    <td class="py-5 px-4 text-sm text-gray-500">{{ formatDate(event.date) }}</td>
                    <td class="py-5 px-4 text-sm text-gray-500">{{ formatTime(event.time) }}</td>
                    <td class="py-5 px-4 text-sm text-gray-500">{{ event.location }}</td>
                    <td class="py-5 px-4">
                        <div class="flex items-center justify-center gap-2">
                             <button 
                                @click="handleEdit(event)"
                                class="p-2 rounded-xl text-[#4FD1C5] border border-gray-100 hover:border-[#4FD1C5] hover:bg-[#4FD1C5]/5 transition-all"
                                title="Edit"
                            >
                                <Pencil class="w-4.5 h-4.5" />
                            </button>
                            <button 
                                @click="handleDelete(event.id)"
                                class="p-2 rounded-xl text-red-500 border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all"
                                title="Delete"
                            >
                                <Trash2 class="w-4.5 h-4.5" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50 pt-6">
        <p class="text-sm text-gray-500 font-medium">
            Showing <span class="text-gray-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="text-gray-900">{{ Math.min(currentPage * itemsPerPage, filteredEvents.length) }}</span> of <span class="text-gray-900">{{ filteredEvents.length }}</span> events
        </p>
        <div class="flex items-center gap-2">
            <button 
                @click="currentPage > 1 && currentPage--"
                :disabled="currentPage === 1"
                class="p-2 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-gray-900 hover:border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft class="w-5 h-5" />
            </button>
            <div class="flex items-center gap-1">
                <button 
                    v-for="page in totalPages" 
                    :key="page"
                    @click="currentPage = page"
                    class="min-w-[40px] h-10 rounded-xl text-sm font-bold transition-all"
                    :class="currentPage === page ? 'bg-[#4FD1C5] text-white shadow-lg shadow-[#4FD1C5]/20' : 'text-gray-500 hover:bg-gray-50'"
                >
                    {{ page }}
                </button>
            </div>
            <button 
                @click="currentPage < totalPages && currentPage++"
                :disabled="currentPage === totalPages"
                class="p-2 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-gray-900 hover:border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight class="w-5 h-5" />
            </button>
        </div>
    </div>

    <!-- No Results -->
    <div v-if="filteredEvents.length === 0" class="py-12 text-center text-gray-400 italic font-medium">
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
