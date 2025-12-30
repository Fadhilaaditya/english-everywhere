<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import ApplicantAcceptModal from './ApplicantAcceptModal.vue'
import Toast from '@/components/Toast.vue'

const applicants = ref<any[]>([])
const isModalOpen = ref(false)
const selectedApplicant = ref<any>(null)

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
        const response = await fetch('http://localhost:3000/api/programs/booked/all')
        if (response.ok) {
            const data = await response.json()
            applicants.value = data.map((item: any) => ({
                id: item.id,
                name: item.applicantName, // Using the name stored in schedule
                gender: item.applicantGender,
                program: item.program ? item.program.title : 'Unknown',
                date: formatDate(item.date),
                fullData: item // Keep full object used for modal
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

onMounted(() => {
    fetchApplicants()
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
    if(confirm('Are you sure you want to delete this applicant data (schedule)?')) {
         // Logic to delete schedule or unbook
         console.log('Deleted applicant:', id)
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
        <h3 class="text-xl font-bold text-gray-900 mb-6">List Applicant</h3>

        <div class="overflow-x-auto">
        <table class="w-full">
            <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Name User</th>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Gender</th>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Program Test</th>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Test Date</th>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
            <tr v-for="applicant in applicants" :key="applicant.id" class="hover:bg-gray-50/50">
                <td class="py-6 px-6 text-sm font-medium text-gray-900">{{ applicant.name }}</td>
                <td class="py-6 px-6 text-sm text-gray-900">{{ applicant.gender }}</td>
                <td class="py-6 px-6 text-sm text-gray-900">{{ applicant.program }}</td>
                <td class="py-6 px-6 text-sm text-gray-900 font-medium">{{ applicant.date }}</td>
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
    </div>
    
    <ApplicantAcceptModal 
        :is-open="isModalOpen"
        :applicant="selectedApplicant"
        @close="isModalOpen = false"
        @submit="handleModalSubmit"
    />
  </div>
</template>
