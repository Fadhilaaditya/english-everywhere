<script setup lang="ts">
import { SquarePen, Trash2, ArrowUpDown, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { ref, onMounted, computed, watch } from 'vue'
import AccountEditModal from './AccountEditModal.vue'
import Toast from '@/components/Toast.vue'
import ConfirmationModal from './ConfirmationModal.vue'

import api from '@/api'

const accounts = ref<any[]>([])
const isModalOpen = ref(false)
const selectedAccount = ref<any>(null)

const searchQuery = ref('')
const selectedStatus = ref('')
const selectedRole = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const totalItems = ref(0)
const totalPages = ref(1)

const statusOptions = ['Waiting List', 'Active', 'Non Active', 'Postponed']

const userRole = localStorage.getItem('role')
const isSuperAdmin = userRole === 'superadmin'

const roleOptions = computed(() => {
    const options = [
        { label: 'Student', value: 'Student' },
        { label: 'Teacher', value: 'Teacher' }
    ]
    if (isSuperAdmin) {
        options.push(
            { label: 'Admin', value: 'Admin' },
            { label: 'Superadmin', value: 'Superadmin' }
        )
    }
    return options
})

const tableError = ref('')
const isLoading = ref(false)

const fetchAccounts = async () => {
    try {
        isLoading.value = true
        tableError.value = ''
        
        const response = await api.get('/users', {
            params: {
                page: currentPage.value,
                limit: itemsPerPage,
                search: searchQuery.value,
                role: selectedRole.value,
                status: selectedStatus.value
            }
        })
        
        const data = response.data
        console.log('[DEBUG] Account API Data:', {
            totalItems: data.totalItems,
            totalPages: data.totalPages,
            usersCount: data.users ? data.users.length : (Array.isArray(data) ? data.length : 'N/A')
        })
        let userList = []
        
        if (data && data.users) {
            // New paginated structure
            userList = data.users
            totalItems.value = data.totalItems || 0
            totalPages.value = data.totalPages || 1
        } else if (Array.isArray(data)) {
            // Legacy array structure
            userList = data
            totalItems.value = data.length
            totalPages.value = Math.ceil(data.length / itemsPerPage)
        } else {
            console.warn('Unexpected API response structure for /users:', data)
            userList = []
        }
        
        accounts.value = userList.map((item: any) => {
            const isStudent = item.role === 'student'
            const profile = isStudent ? item.studentProfile : item.teacherProfile
            
            return {
                id: item.id,
                name: item.fullName || (profile ? profile.name : '-'),
                username: item.username,
                dob: profile && profile.birthDate ? formatDate(profile.birthDate) : '-',
                role: capitalize(item.role),
                status: isStudent && profile && profile.status ? profile.status : '-',
                fullData: item 
            }
        })
    } catch (e: any) {
        console.error('Failed to fetch accounts', e)
        tableError.value = e.response?.data?.message || e.message
    } finally {
        isLoading.value = false
    }
}

// Re-fetch when page or filters change
watch([searchQuery, selectedStatus, selectedRole], () => {
    currentPage.value = 1
    fetchAccounts()
})

watch(currentPage, () => {
    fetchAccounts()
})

const visiblePages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const maxVisible = 5
    
    if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }
    
    let start = Math.max(1, current - Math.floor(maxVisible / 2))
    let end = start + maxVisible - 1
    
    if (end > total) {
        end = total
        start = end - maxVisible + 1
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
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
         await api.delete(`/users/${accountToDelete.value}`)
        
        showToastNotification('Account deleted successfully')
        fetchAccounts()
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
        <div class="flex flex-col gap-1">
            <h3 class="text-xl font-bold text-gray-900">List Account's</h3>
            <div v-if="tableError" class="text-red-500 text-xs font-medium">
                ⚠️ {{ tableError }}
            </div>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div class="relative w-full sm:w-80">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search by name, username or status..."
                    class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all text-sm"
                />
            </div>

            <div class="relative w-full sm:w-48">
                <select 
                    v-model="selectedStatus"
                    class="w-full pl-3 pr-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all text-sm appearance-none bg-white font-medium text-gray-700"
                >
                    <option value="">All Status</option>
                    <option v-for="status in statusOptions" :key="status" :value="status">
                        {{ status }}
                    </option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ArrowUpDown class="w-3 h-3" />
                </div>
            </div>

            <div class="relative w-full sm:w-40">
                <select 
                    v-model="selectedRole"
                    class="w-full pl-3 pr-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all text-sm appearance-none bg-white font-medium text-gray-700"
                >
                    <option value="">All Role</option>
                    <option v-for="role in roleOptions" :key="role.value" :value="role.value">
                        {{ role.label }}
                    </option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ArrowUpDown class="w-3 h-3" />
                </div>
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
                        Status <ArrowUpDown class="w-3 h-3" />
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
            <tbody class="divide-y divide-gray-100 italic" v-if="isLoading">
                <tr>
                    <td colspan="6" class="py-12 text-center text-gray-500">Loading accounts...</td>
                </tr>
            </tbody>
            <tbody class="divide-y divide-gray-100" v-else>
            <tr v-for="account in accounts" :key="account.id" class="hover:bg-gray-50/50">
                <td class="py-4 px-6 text-sm font-bold text-gray-700">{{ account.name }}</td>
                <td class="py-4 px-6 text-sm text-gray-600">{{ account.username }}</td>
                <td class="py-4 px-6 text-sm text-gray-600">{{ account.dob }}</td>
                <td class="py-4 px-6 text-center">
                    <span 
                        v-if="account.status !== '-'"
                        class="px-2.5 py-1.5 rounded-md text-xs font-semibold capitalize"
                        :class="{
                            'bg-green-100 text-green-700': account.status === 'active',
                            'bg-yellow-100 text-yellow-700': account.status === 'waiting list',
                            'bg-gray-100 text-gray-700': account.status === 'non active',
                            'bg-red-100 text-red-700': account.status === 'postponed'
                        }"
                    >
                        {{ account.status }}
                    </span>
                    <span v-else class="text-sm text-gray-400">-</span>
                </td>
                <td class="py-4 px-6 text-center">
                    <div class="flex justify-center">
                        <span 
                            class="inline-flex items-center justify-center px-4 py-1.5 rounded-md text-sm font-medium min-w-[110px] text-center capitalize"
                            :class="{
                                'bg-[#FFE2CC] text-gray-800': account.role === 'Teacher',
                                'bg-[#EFF2FC] text-gray-800': account.role === 'Student',
                                'bg-purple-100 text-purple-800': account.role === 'Admin',
                                'bg-red-100 text-red-800': account.role === 'Superadmin'
                            }"
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
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} results
            </p>
            <div class="flex items-center gap-2">
                <button 
                    @click="currentPage > 1 && currentPage--"
                    :disabled="currentPage === 1 || isLoading"
                    class="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft class="w-4 h-4" />
                </button>
                <div class="flex items-center gap-1">
                    <button 
                        v-for="page in visiblePages" 
                        :key="page"
                        @click="typeof page === 'number' && (currentPage = page)"
                        :disabled="isLoading"
                        class="px-3 py-1 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                        :class="currentPage === page ? 'bg-[#4FD1C5] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
                    >
                        {{ page }}
                    </button>
                </div>
                <button 
                    @click="currentPage < totalPages && currentPage++"
                    :disabled="currentPage === totalPages || isLoading"
                    class="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- No Results -->
        <div v-if="accounts.length === 0 && !isLoading" class="py-12 text-center text-gray-500 italic">
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
