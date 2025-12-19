<script setup lang="ts">
import { ref } from 'vue'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'
import EventModal from './EventModal.vue'
import EventAlert from './EventAlert.vue'

const events = ref([
    {
        id: 1,
        title: 'English Playdate: Cooking with Friends',
        price: '25K',
        date: '2025-01-15', // YYYY-MM-DD for easier comparison
        startDate: '15/01/2025',
        time: '19.00 - 20.00 WIB'
    },
    {
        id: 2,
        title: 'Holiday Prep: Christmas Carol Karaoke',
        price: '25K',
        date: '2025-01-15',
        startDate: '15/01/2025',
        time: '19.00 - 20.00 WIB'
    },
    {
        id: 3,
        title: 'Speaking Club: New Year Resolution',
        price: '25K',
        date: '2025-01-15',
        startDate: '15/01/2025',
        time: '19.00 - 20.00 WIB'
    },
    {
        id: 4,
        title: 'Speeling Bee Challange 2025',
        price: '25K',
        date: '2025-01-15', 
        startDate: '15/01/2025',
        time: '19.00 - 20.00 WIB',
        isPast: true
    },
    {
        id: 5,
        title: 'Grammar Clinic: Present Tenses Mastery',
        price: '25K',
        date: '2025-01-15',
        startDate: '15/01/2025',
        time: '19.00 - 20.00 WIB',
        isPast: true
    },
    {
        id: 6,
        title: 'TOEFL Simulation Test',
        price: '25K',
        date: '2025-01-15',
        startDate: '15/01/2025',
        time: '19.00 - 20.00 WIB',
        isPast: true
    },
    {
        id: 7,
        title: "English Movie Night: The King's Speech",
        price: '25K',
        date: '2025-01-15',
        startDate: '15/01/2025',
        time: '19.00 - 20.00 WIB',
        isPast: true
    },
    {
        id: 8,
        title: 'IELTS Speaking Practice with Native Speaker',
        price: '25K',
        date: '2025-01-15',
        startDate: '15/01/2025',
        time: '19.00 - 20.00 WIB',
        isPast: true
    }
])

const isModalOpen = ref(false)
const selectedEvent = ref(null as any)

// Alert State
const isAlertOpen = ref(false)
const alertType = ref<'create' | 'update' | 'delete'>('create')
const pendingData = ref<any>(null)
const pendingDeleteId = ref<number | null>(null)

const handleCreateEvent = () => {
    selectedEvent.value = null
    isModalOpen.value = true
}


const handleEditEvent = (event: any) => {
    selectedEvent.value = event
    isModalOpen.value = true
}

const handleDeleteClick = (id: number) => {
    pendingDeleteId.value = id
    alertType.value = 'delete'
    isAlertOpen.value = true
}

const handleModalSubmit = (data: any) => {
    pendingData.value = data
    alertType.value = selectedEvent.value ? 'update' : 'create'
    isModalOpen.value = false
    isAlertOpen.value = true
}

const handleAlertConfirm = () => {
    if (alertType.value === 'create') {
        const newId = Math.max(...events.value.map(e => e.id)) + 1
        events.value.unshift({
            id: newId,
            ...pendingData.value,
            startDate: pendingData.value.date ? pendingData.value.date.split('-').reverse().join('/') : '15/01/2025', // Mock logic
        })
    } else if (alertType.value === 'update' && selectedEvent.value) {
        // Find and update
        const index = events.value.findIndex(e => e.id === selectedEvent.value.id)
        if (index !== -1) {
            events.value[index] = { ...events.value[index], ...pendingData.value }
        }
    } else if (alertType.value === 'delete' && pendingDeleteId.value) {
        events.value = events.value.filter(e => e.id !== pendingDeleteId.value)
    }

    isAlertOpen.value = false
    pendingData.value = null
    pendingDeleteId.value = null
    selectedEvent.value = null
}
</script>

<template>
  <div class="bg-white rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-bold text-gray-900">List Events</h2>
        <button 
            @click="handleCreateEvent"
            class="bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
            Create Events
            <Plus class="w-4 h-4" />
        </button>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full">
            <thead>
                <tr class="border-b border-gray-100 text-left">
                    <th class="py-4 px-4 font-medium text-gray-900 w-1/3">Title</th>
                    <th class="py-4 px-4 font-medium text-gray-900">Price</th>
                    <th class="py-4 px-4 font-medium text-gray-900">Date</th>
                    <th class="py-4 px-4 font-medium text-gray-900">Time</th>
                    <th class="py-4 px-4 font-medium text-gray-900 text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="event in events" 
                    :key="event.id"
                    class="border-b border-gray-100 last:border-b-0 transition-colors"
                    :class="{'bg-[#D9D9D9]': event.isPast, 'hover:bg-gray-50': !event.isPast}"
                >
                    <td class="py-4 px-4 text-gray-700">{{ event.title }}</td>
                    <td class="py-4 px-4 text-gray-700">{{ event.price }}</td>
                    <td class="py-4 px-4 text-gray-700">{{ event.startDate }}</td>
                    <td class="py-4 px-4 text-gray-700">{{ event.time }}</td>
                    <td class="py-4 px-4">
                        <div class="flex items-center justify-center gap-3">
                             <button 
                                @click="handleEditEvent(event)"
                                class="p-1.5 rounded-md transition-colors"
                                :class="event.isPast ? 'text-gray-500 hover:bg-gray-200' : 'text-[#4FD1C5] border border-[#4FD1C5] hover:bg-[#4FD1C5]/10'"
                            >
                                <Pencil class="w-4 h-4" />
                            </button>
                            <button 
                                @click="handleDeleteClick(event.id)"
                                class="p-1.5 rounded-md transition-colors"
                                :class="event.isPast ? 'text-gray-500 hover:bg-gray-200' : 'text-red-500 border border-red-500 hover:bg-red-50'"
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <EventModal 
        :is-open="isModalOpen"
        :event="selectedEvent"
        @close="isModalOpen = false"
        @submit="handleModalSubmit"
    />

    <EventAlert 
        :is-open="isAlertOpen"
        :type="alertType"
        @close="isAlertOpen = false"
        @confirm="handleAlertConfirm"
    />
  </div>
</template>
