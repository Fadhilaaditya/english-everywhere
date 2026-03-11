<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import ApplicantAcceptModal from './ApplicantAcceptModal.vue'
import ConfirmModal from './ConfirmModal.vue'
import Toast from '@/components/Toast.vue'

const applicants = ref<any[]>([])
const isModalOpen = ref(false)
const selectedApplicant = ref<any>(null)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Search and Pagination State
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredApplicants = computed(() => {
    if (!searchQuery.value) return applicants.value
    const query = searchQuery.value.toLowerCase()
    return applicants.value.filter(app => 
        app.name.toLowerCase().includes(query) || 
        app.phone.toLowerCase().includes(query)
    )
})

const totalPages = computed(() => Math.ceil(filteredApplicants.value.length / itemsPerPage))

const paginatedApplicants = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredApplicants.value.slice(start, end)
})

// Reset to first page when searching
watch(searchQuery, () => {
    currentPage.value = 1
})

// Delete Modal State
const isDeleteModalOpen = ref(false)
const applicantToDelete = ref<number | null>(null)
const isDeleting = ref(false)

// Toast State
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showToastNotification = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
}

const fetchApplicants = async () => {
    try {
        const response = await fetch(`${API_URL}/programs/bookings/all?status=ACCEPTED`)
        if (response.ok) {
            const data = await response.json()
            applicants.value = data.map((item: any) => ({
                id: item.id,
                name: item.applicantName,
                gender: item.applicantGender,
                phone: item.applicantPhone || '-',
                date: formatDate(item.schedule?.date),
                fullData: item
            }))
        }
    } catch (e) {
        console.error('Failed to fetch applicants', e)
    }
}

const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB') 
}

let pollingInterval: any = null

const markAsRead = async () => {
    try {
        await fetch(`${API_URL}/programs/bookings/mark-read`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'ACCEPTED' })
        })
    } catch (e) {
        console.error('Failed to mark as read', e)
    }
}

onMounted(() => {
    fetchApplicants()
    markAsRead()
    // Poll every 3 seconds for real-time updates
    pollingInterval = setInterval(fetchApplicants, 3000)
})

onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval)
})

const handleAccept = (applicant: any) => {
    selectedApplicant.value = applicant.fullData // Pass full data if needed or just the mapped object
    isModalOpen.value = true
}

// ... existing code ...

const handleModalSubmit = (data: any) => {
    console.log('Creating account for:', data)
    showToastNotification('Student Account Created Successfully!', 'success')
    isModalOpen.value = false
    fetchApplicants()
}

const handleDelete = (id: number) => {
    applicantToDelete.value = id
    isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
    if (!applicantToDelete.value) return
    
    isDeleting.value = true
    try {
        const response = await fetch(`${API_URL}/programs/bookings/${applicantToDelete.value}`, {
            method: 'DELETE'
        })
        
        if (response.ok) {
            showToastNotification('Applicant deleted and schedule reverted to available', 'success')
            fetchApplicants()
            isDeleteModalOpen.value = false
        } else {
            throw new Error('Failed to revert schedule')
        }
    } catch (e) {
        console.error('Failed to delete applicant', e)
        showToastNotification('Failed to delete applicant', 'error')
    } finally {
        isDeleting.value = false
        applicantToDelete.value = null
    }
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-100 mt-8">
    <Toast 
        :show="showToast" 
        :message="toastMessage" 
        :type="toastType" 
        @close="showToast = false" 
    />
    <div class="p-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h3 class="text-xl font-bold text-gray-900">List Applicant</h3>
            
            <div class="w-full md:w-80 relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search name or phone..."
                    class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all text-sm"
                />
            </div>
        </div>

        <div class="overflow-x-auto">
        <table class="w-full">
            <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Name User</th>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Gender</th>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Phone Number</th>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Test Date</th>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
            <tr v-for="applicant in paginatedApplicants" :key="applicant.id" class="hover:bg-gray-50/50">
                <td class="py-6 px-6 text-sm font-medium text-gray-900">{{ applicant.name }}</td>
                <td class="py-6 px-6 text-sm text-gray-900">{{ applicant.gender }}</td>
                <td class="py-6 px-6 text-sm text-gray-900 text-left">{{ applicant.phone }}</td>
                <td class="py-6 px-6 text-sm text-gray-900 font-medium whitespace-nowrap">{{ applicant.date }}</td>
                <td class="py-6 px-6">
                    <div class="flex items-center gap-4">
                        <button 
                            @click="handleAccept(applicant)"
                            class="px-6 py-1.5 rounded-full border border-gray-900 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                        >
                            Accept
                        </button>
                        <button 
                            @click="handleDelete(applicant.id)"
                            class="p-2 text-red-300 hover:text-red-500 transition-colors"
                        >
                            <Trash2 class="w-5 h-5" />
                        </button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50 pt-6">
            <p class="text-sm text-gray-500">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredApplicants.length) }} of {{ filteredApplicants.length }} applicants
            </p>
            <div class="flex items-center gap-2">
                <button 
                    @click="currentPage > 1 && currentPage--"
                    :disabled="currentPage === 1"
                    class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    <ChevronLeft class="w-4 h-4" />
                </button>
                <div class="flex items-center gap-1">
                    <button 
                        v-for="page in totalPages" 
                        :key="page"
                        @click="currentPage = page"
                        class="px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all"
                        :class="currentPage === page ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
                    >
                        {{ page }}
                    </button>
                </div>
                <button 
                    @click="currentPage < totalPages && currentPage++"
                    :disabled="currentPage === totalPages"
                    class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredApplicants.length === 0" class="py-12 text-center text-gray-500 italic">
            No applicants found matching "{{ searchQuery }}"
        </div>
    </div>
    
    <ApplicantAcceptModal 
        :is-open="isModalOpen"
        :applicant="selectedApplicant"
        @close="isModalOpen = false"
        @submit="handleModalSubmit"
    />
    
    <ConfirmModal 
        :is-open="isDeleteModalOpen"
        title="Delete Applicant"
        message="Are you sure you want to delete this applicant data? The schedule will become AVAILABLE again."
        confirm-text="Delete"
        type="danger"
        :is-loading="isDeleting"
        @close="isDeleteModalOpen = false"
        @confirm="confirmDelete"
    />
  </div>
</template>
