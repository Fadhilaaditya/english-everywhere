<script setup lang="ts">
import { ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import ApplicantAcceptModal from './ApplicantAcceptModal.vue'

const applicants = [
  { id: 1, name: 'Yoga', gender: 'Male', program: 'Hi Kids!', date: '18/09/2025' },
  { id: 2, name: 'Budi', gender: 'Male', program: 'Get Smart', date: '18/09/2025' },
]

const isModalOpen = ref(false)
const selectedApplicant = ref<any>(null)

const handleAccept = (applicant: any) => {
    selectedApplicant.value = applicant
    isModalOpen.value = true
}

const handleModalSubmit = (data: any) => {
    console.log('Creating account for:', data)
    alert('Student Account Created Successfully!')
    isModalOpen.value = false
    // Here you would typically make an API call to create the user and update the applicant status
}

const handleDelete = (id: number) => {
    if(confirm('Are you sure you want to delete this applicant?')) {
         console.log('Deleted applicant:', id)
    }
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-100 mt-8">
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
