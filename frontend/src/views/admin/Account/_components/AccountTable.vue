<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SquarePen, Trash2, ArrowUpDown, Plus } from 'lucide-vue-next'
import AccountEditModal from './AccountEditModal.vue'
import Toast from '@/components/Toast.vue'
import ConfirmationModal from './ConfirmationModal.vue'

const accounts = ref<any[]>([])
const isModalOpen = ref(false)
const selectedAccount = ref<any>(null)

const fetchAccounts = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/students')
        if (response.ok) {
            const data = await response.json()
            accounts.value = data.map((item: any) => ({
                id: item.id,
                name: item.name,
                username: item.user ? item.user.username : '-',
                dob: formatDate(item.birthDate),
                role: item.user ? capitalize(item.user.role) : 'Student',
                fullData: item 
            }))
        }
    } catch (e) {
        console.error('Failed to fetch accounts', e)
    }
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    // Format DD/MM/YYYY
    return date.toLocaleDateString('en-GB')
}

const capitalize = (s: string) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

onMounted(() => {
    fetchAccounts()
})

const isDeleteConfirmOpen = ref(false)
const accountToDelete = ref<number | null>(null)

// Toast State
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showToastNotification = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
}

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
    showToastNotification('Account Saved Successfully!')
    isModalOpen.value = false
    fetchAccounts()
}

const handleDelete = (id: number) => {
    accountToDelete.value = id
    isDeleteConfirmOpen.value = true
}

const processDelete = async () => {
    if (!accountToDelete.value) return
    
    isDeleteConfirmOpen.value = false
    try {
        // Implement delete API call
         const response = await fetch(`http://localhost:3000/api/students/${accountToDelete.value}`, {
            method: 'DELETE'
        })
        
        if (response.ok) {
            showToastNotification('Account deleted successfully')
            fetchAccounts()
        } else {
            throw new Error('Failed to delete')
        }
    } catch (e) {
        console.error('Failed to delete account', e)
        showToastNotification('Failed to delete account', 'error')
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

    <ConfirmationModal
        :is-open="isDeleteConfirmOpen"
        title="Delete Account"
        message="Are you sure you want to delete this account? This action cannot be undone."
        confirm-text="Delete"
        type="danger"
        @close="isDeleteConfirmOpen = false"
        @confirm="processDelete"
    />

    <Toast 
        :show="showToast" 
        :message="toastMessage" 
        :type="toastType"
        @close="showToast = false"
    />
  </div>
</template>
