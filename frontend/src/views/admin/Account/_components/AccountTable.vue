<script setup lang="ts">
import { ref } from 'vue'
import { SquarePen, Trash2, ArrowUpDown, Plus } from 'lucide-vue-next'
import AccountEditModal from './AccountEditModal.vue'

const accounts = [
  { id: 1, name: 'Yoga Amatir', username: 'yoga.amatir', dob: '15/04/2003', role: 'Student' },
  { id: 2, name: 'Budi Santoso', username: 'budi.santoso', dob: '12/11/2005', role: 'Student' },
  { id: 3, name: 'Siti Aminah', username: 'siti.aminah', dob: '05/03/2006', role: 'Student' },
  { id: 4, name: 'Kevin Wijaya', username: 'kevin.wijaya', dob: '21/08/2004', role: 'Student' },
  { id: 5, name: 'Tono Susanto', username: 'tono.susanto', dob: '25/07/1988', role: 'Teacher' },
  { id: 6, name: 'Maya Sari', username: 'maya.sari', dob: '09/01/2007', role: 'Student' },
  { id: 7, name: 'Anisa Putri', username: 'anisa.putri', dob: '03/09/1990', role: 'Teacher' },
  { id: 8, name: 'Agung Pramono', username: 'agung.pramono', dob: '15/04/2003', role: 'Student' },
]

const isModalOpen = ref(false)
const selectedAccount = ref<any>(null)

const handleEdit = (account: any) => {
    selectedAccount.value = account
    isModalOpen.value = true
}

const handleCreate = () => {
    selectedAccount.value = null
    isModalOpen.value = true
}

const handleModalSubmit = (data: any) => {
    console.log('Account saved:', data)
    alert('Account Saved Successfully!')
    isModalOpen.value = false
}

const handleDelete = (id: number) => {
     if(confirm('Are you sure you want to delete this account?')) {
        console.log('Delete account:', id)
    }
}
</script>

<template>
  <div class="mt-8">
    <!-- Header with Create Button -->
    <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-900">List Account's</h3>
        <button 
            @click="handleCreate"
            class="bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg shadow-[#4FD1C5]/20"
        >
            Create Account
            <Plus class="w-4 h-4" />
        </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
        <table class="w-full">
            <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                    <div class="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                        Name <ArrowUpDown class="w-3 h-3" />
                    </div>
                </th>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                    <div class="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                        Username <ArrowUpDown class="w-3 h-3" />
                    </div>
                </th>
                 <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                    <div class="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                        Date of Birth <ArrowUpDown class="w-3 h-3" />
                    </div>
                </th>
                 <th class="py-4 px-6 text-center text-sm font-semibold text-gray-900">
                    <div class="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-600">
                        Role <ArrowUpDown class="w-3 h-3" />
                    </div>
                </th>
                <th class="py-4 px-6 text-center text-sm font-semibold text-gray-900">
                    <div class="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-600">
                        Action <ArrowUpDown class="w-3 h-3" />
                    </div>
                </th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
            <tr v-for="account in accounts" :key="account.id" class="hover:bg-gray-50/50">
                <td class="py-4 px-6 text-sm font-bold text-gray-700">{{ account.name }}</td>
                <td class="py-4 px-6 text-sm text-gray-600">{{ account.username }}</td>
                <td class="py-4 px-6 text-sm text-gray-600">{{ account.dob }}</td>
                <td class="py-4 px-6">
                    <div class="flex justify-center">
                        <span 
                            class="px-8 py-1.5 rounded-md text-sm font-medium w-32 text-center"
                            :class="account.role === 'Teacher' ? 'bg-[#FFE2CC] text-gray-800' : 'bg-[#EFF2FC] text-gray-800'"
                        >
                            {{ account.role }}
                        </span>
                    </div>
                </td>
                <td class="py-4 px-6">
                    <div class="flex items-center justify-center gap-3">
                        <button 
                            @click="handleEdit(account)"
                            class="p-1.5 text-gray-400 hover:text-gray-600 transition-colors border border-gray-300 rounded"
                        >
                            <SquarePen class="w-4 h-4" />
                        </button>
                        <button 
                            @click="handleDelete(account.id)"
                            class="p-1.5 text-red-300 hover:text-red-500 transition-colors border border-red-200 rounded"
                        >
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

    <AccountEditModal 
        :is-open="isModalOpen"
        :account="selectedAccount"
        @close="isModalOpen = false"
        @submit="handleModalSubmit"
    />
  </div>
</template>
