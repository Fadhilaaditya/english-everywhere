<script setup lang="ts">
import { SquarePen, Trash2, ArrowUpDown, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { ref, onMounted, computed, watch } from 'vue'
import AccountEditModal from './AccountEditModal.vue'
import Toast from '@/components/Toast.vue'
import ConfirmationModal from './ConfirmationModal.vue'

const accounts = ref<any[]>([])
const isModalOpen = ref(false)
const selectedAccount = ref<any>(null)

// Search and Pagination State
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredAccounts = computed(() => {
    if (!searchQuery.value) return accounts.value
    const query = searchQuery.value.toLowerCase()
    return accounts.value.filter(acc => 
        acc.name.toLowerCase().includes(query) || 
        acc.username.toLowerCase().includes(query)
    )
})

const totalPages = computed(() => Math.ceil(filteredAccounts.value.length / itemsPerPage))

const paginatedAccounts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredAccounts.value.slice(start, end)
})

// Reset to first page when searching
watch(searchQuery, () => {
    currentPage.value = 1
})

const fetchAccounts = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/users')
        if (response.ok) {
            const data = await response.json()
            accounts.value = data.map((item: any) => {
                const isStudent = item.role === 'student'
                const profile = isStudent ? item.studentProfile : item.teacherProfile
                
                return {
                    id: item.id,
                    name: item.fullName || (profile ? profile.name : '-'),
                    username: item.username,
                    dob: profile && profile.birthDate ? formatDate(profile.birthDate) : '-',
                    role: capitalize(item.role),
                    fullData: item 
                }
            })
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
         const response = await fetch(`http://localhost:3001/api/users/${accountToDelete.value}`, {
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
    <!-- Header: Title, Search, and Create Button -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 class="text-xl font-bold text-gray-900">List Account's</h3>
        
        <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div class="relative w-full sm:w-80">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search by name or username..."
                    class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all text-sm"
                />
            </div>
            
            <button 
                @click="handleCreate"
                class="bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg shadow-[#4FD1C5]/20 w-full sm:w-auto justify-center whitespace-nowrap"
            >
                Create Account
                <Plus class="w-4 h-4" />
            </button>
        </div>
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
            <tr v-for="account in paginatedAccounts" :key="account.id" class="hover:bg-gray-50/50">
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

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p class="text-sm text-gray-500">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredAccounts.length) }} of {{ filteredAccounts.length }} results
            </p>
            <div class="flex items-center gap-2">
                <button 
                    @click="currentPage > 1 && currentPage--"
                    :disabled="currentPage === 1"
                    class="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft class="w-4 h-4" />
                </button>
                <div class="flex items-center gap-1">
                    <button 
                        v-for="page in totalPages" 
                        :key="page"
                        @click="currentPage = page"
                        class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        :class="currentPage === page ? 'bg-[#4FD1C5] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
                    >
                        {{ page }}
                    </button>
                </div>
                <button 
                    @click="currentPage < totalPages && currentPage++"
                    :disabled="currentPage === totalPages"
                    class="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredAccounts.length === 0" class="py-12 text-center text-gray-500 italic">
            No accounts found matching "{{ searchQuery }}"
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
