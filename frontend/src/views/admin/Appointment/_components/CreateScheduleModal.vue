<script setup lang="ts">
import { ref } from 'vue'
import { X, Calendar, Clock } from 'lucide-vue-next'
import ConfirmModal from './ConfirmModal.vue'

const props = defineProps<{
  isOpen: boolean
  programId: number | null
  programName?: string
  initialDate?: string
}>()

const emit = defineEmits(['close', 'submit'])
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const date = ref('')
const time = ref('')
const maxSlots = ref(1)
const programs = ref<any[]>([])
const selectedProgramId = ref<number | null>(null)
const isLoading = ref(false)
const isConfirmModalOpen = ref(false)

// Populate date from prop when modal opens
import { watch } from 'vue'
watch(() => props.isOpen, async (newVal) => {
    if (newVal) {
        if (props.initialDate) date.value = props.initialDate
        selectedProgramId.value = props.programId
        
        // Fetch programs if not already passed or if list is empty
        try {
            const response = await fetch(`${API_URL}/programs`)
            if (response.ok) {
                programs.value = await response.json()
            }
        } catch (e) {
            console.error('Failed to fetch programs in modal', e)
        }
    }
})

const handleCreateClick = () => {
    if (!date.value || !time.value || maxSlots.value < 1) return
    isConfirmModalOpen.value = true
}

const executeCreate = async () => {
    if (!date.value || !time.value) return
    
    isLoading.value = true
    try {
        const payload = {
            programId: null,
            date: date.value,
            time: time.value,
            maxSlots: maxSlots.value,
            status: 'AVAILABLE'
        }
        
        const response = await fetch(`${API_URL}/programs/schedules/global`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        
        if (!response.ok) throw new Error('Failed to create schedule')
        
        emit('submit')
        emit('close')
        isConfirmModalOpen.value = false
        
        // Reset form
        date.value = ''
        time.value = ''
        maxSlots.value = 1
        // alert removed, parent handles it
    } catch (error) {
        console.error('Error creating schedule:', error)
        // alert removed, potentially emit error or let user retry
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl w-full max-w-md shadow-xl p-8">
        <!-- Close Button -->
        <button 
            @click="$emit('close')"
            class="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
            <X class="w-6 h-6" />
        </button>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Create Schedule</h2>
        
        <!-- Form -->
        <div class="space-y-6">
            <!-- Date -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <div class="relative">
                     <input 
                        v-model="date"
                        type="date"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>
            </div>

            <!-- Time -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Time</label>
                 <div class="relative">
                     <input 
                        v-model="time"
                        type="time"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>
            </div>

            <!-- Max Slots -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Total Slots (Quota)</label>
                 <div class="relative">
                     <input 
                        v-model="maxSlots"
                        type="number"
                        min="1"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>
            </div>
            
            <!-- Submit Button -->
            <button 
                @click="handleCreateClick"
                :disabled="isLoading || !date || !time || maxSlots < 1"
                class="w-full py-3 rounded-lg text-white font-medium transition-colors bg-[#4FD1C5] hover:bg-[#3dbdb0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {{ isLoading ? 'Creating...' : 'Create Schedule' }}
            </button>
        </div>
    </div>
  </div>

    <ConfirmModal 
        :is-open="isConfirmModalOpen"
        title="Confirm Schedule Creation"
        message="Are you sure you want to create this schedule?"
        confirm-text="Create Schedule"
        :is-loading="isLoading"
        @close="isConfirmModalOpen = false"
        @confirm="executeCreate"
    />
</template>
