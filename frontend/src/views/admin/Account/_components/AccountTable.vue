<script setup lang="ts">
import { SquarePen, Trash2, ArrowUpDown, Plus, Search, ChevronLeft, ChevronRight, FileUp, Download } from 'lucide-vue-next'
import { ref, onMounted, computed, watch } from 'vue'
import * as XLSX from 'xlsx'
import AccountEditModal from './AccountEditModal.vue'
import AccountImportPreviewModal from './AccountImportPreviewModal.vue'
import Toast from '@/components/Toast.vue'
import ConfirmationModal from './ConfirmationModal.vue'

import api from '@/api'

const accounts = ref<any[]>([])
const isModalOpen = ref(false)
const selectedAccount = ref<any>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const isImporting = ref(false)
const isImportPreviewOpen = ref(false)
const importData = ref<any[]>([])

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

const fetchAccounts = async () => {
    try {
        const response = await api.get('/users')
        const data = response.data
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
         await api.delete(`/users/${accountToDelete.value}`)
        
        showToastNotification('Account deleted successfully')
        fetchAccounts()
    } catch (e) {
        console.error('Failed to delete account', e)
        showToastNotification('Failed to delete account', 'error')
    }
}

const triggerImport = () => {
    fileInput.value?.click()
}

const downloadTemplate = () => {
    const headers = ['fullName', 'username', 'email', 'phone', 'role', 'address', 'gender', 'birthDate', 'fatherName', 'motherName', 'course']
    const sampleData = [
        ['John Doe', 'johndoe', 'john@example.com', '08123456789', 'student', 'Jalan Merdeka No. 123', 'Male', '10/05/2010', 'Ayah John', 'Bunda John', 'Abracadabra 1'],
        ['Jane Smith', 'janesmith', 'jane@example.com', '08123456780', 'teacher', 'Jalan Thamrin No. 45', 'Female', '20/08/1990', '', '', '']
    ]
    
    let csvContent = headers.join(',') + '\n'
    sampleData.forEach(row => {
        csvContent += row.join(',') + '\n'
    })

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'account_import_template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

const processFile = async (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return

    const file = input.files[0]
    if (!file) return

    const reader = new FileReader()
    const fileName = file.name.toLowerCase()

    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer)
            const workbook = XLSX.read(data, { 
                type: 'array',
                cellDates: true,
                cellNF: false,
                cellText: false
            })
            const firstSheetName = workbook.SheetNames[0]
            if (!firstSheetName) return
            
            const firstSheet = workbook.Sheets[firstSheetName]
            if (!firstSheet) return
            
            const jsonData = XLSX.utils.sheet_to_json(firstSheet)
            processImportData(mapXlsxToInternal(jsonData))
        }
        reader.readAsArrayBuffer(file)
    } else {
        reader.onload = async (e) => {
            const text = e.target?.result as string
            if (!text) return
            processImportData(parseCSV(text))
        }
        reader.readAsText(file)
    }
    
    input.value = '' // Reset input
}

const processImportData = (data: any[]) => {
    if (data.length === 0) {
        showToastNotification('No valid data found in file', 'error')
        return
    }

    importData.value = data
    isImportPreviewOpen.value = true
}

const confirmImport = async () => {
    console.log('[DEBUG] Confirming import with data:', importData.value)
    console.log('[DEBUG] Column keys in first row:', Object.keys(importData.value[0] || {}))
    isImporting.value = true
    try {
        const response = await api.post('/users/import', importData.value)
        showToastNotification(response.data.message)
        isImportPreviewOpen.value = false
        importData.value = []
        fetchAccounts()
    } catch (err: any) {
        console.error('Import failed', err)
        showToastNotification(err.response?.data?.message || 'Import failed', 'error')
    } finally {
        isImporting.value = false
    }
}

const mapXlsxToInternal = (data: any[]) => {
    return data.map(item => {
        const mapped: any = {}
        Object.keys(item).forEach(key => {
            const h = key.trim().toLowerCase()
            const value = item[key]?.toString().trim() || ''

            if (['fullname', 'name', 'nama lengkap', 'nama_lengkap', 'full name'].includes(h)) mapped.fullName = value
            else if (['username', 'user'].includes(h)) mapped.username = value
            else if (['email', 'email dummy'].includes(h)) mapped.email = value
            else if (['phone', 'phonenumber', 'no telp', 'no_hp', 'telepon', 'phonenumber'].includes(h)) mapped.phone = value
            else if (['role'].includes(h)) mapped.role = value.toLowerCase()
            else if (['address', 'alamat'].includes(h)) mapped.address = value
            else if (['birthplace', 'birth_place', 'tempat lahir', 'tempat_lahir'].includes(h)) mapped.birthPlace = value
            else if (['fathername', 'nama ayah', 'nama_ayah', 'parents name', 'parents_name'].includes(h)) mapped.fatherName = value
            else if (['mothername', 'nama ibu', 'nama_ibu'].includes(h)) mapped.motherName = value
            else if (['course', 'program', 'kursus', 'level'].includes(h)) mapped.course = value
            else if (['gender', 'jenis kelamin'].includes(h)) mapped.gender = value
            else if (['birthdate', 'birth date', 'date of birth', 'dob', 'tanggal lahir', 'tgl lahir', 'lahir'].includes(h)) {
                // If value looks like an Excel serialized date (number), or a raw Date object
                // mapXlsxToInternal currently converts everything to string via .toString()
                // I should check the raw value if possible, but for now let's fix formatImportDate
                mapped.birthDate = formatImportDate(value)
            }
            else mapped[key] = value
        })

        if (!mapped.role) mapped.role = 'student'
        if (!mapped.username && mapped.fullName) {
             mapped.username = mapped.fullName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
        }
        return mapped
    }).filter(m => m.fullName && m.username)
}

const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
    if (lines.length < 2) return []

    // Detect delimiter (tab or comma)
    const header = lines[0] || ''
    const delimiter = header.includes('\t') ? '\t' : ','
    const headers = header.split(delimiter).map(h => h.trim().toLowerCase())

    const result = []
    for (let i = 1; i < lines.length; i++) {
        const lineContent = lines[i]
        if (!lineContent) continue
        
        const currentLine = lineContent.split(delimiter)
        if (currentLine.length < headers.length) continue

        const obj: any = {}
        headers.forEach((h, index) => {
            const value = currentLine[index]?.trim() || ''
            
            // Map common aliases
            if (['fullname', 'name', 'nama lengkap', 'nama_lengkap', 'full name'].includes(h)) obj.fullName = value
            else if (['username', 'user'].includes(h)) obj.username = value
            else if (['email', 'email dummy'].includes(h)) obj.email = value
            else if (['phone', 'phonenumber', 'no telp', 'no_hp', 'telepon', 'phonenumber'].includes(h)) obj.phone = value
            else if (['role'].includes(h)) obj.role = value.toLowerCase()
            else if (['address', 'alamat'].includes(h)) obj.address = value
            else if (['birthplace', 'birth_place', 'tempat lahir', 'tempat_lahir'].includes(h)) obj.birthPlace = value
            else if (['fathername', 'nama ayah', 'nama_ayah', 'parents name', 'parents_name'].includes(h)) obj.fatherName = value
            else if (['mothername', 'nama ibu', 'nama_ibu'].includes(h)) obj.motherName = value
            else if (['course', 'program', 'kursus', 'level'].includes(h)) obj.course = value
            else if (['gender', 'jenis kelamin'].includes(h)) obj.gender = value
            else if (['birthdate', 'birth date', 'date of birth', 'dob', 'tanggal lahir', 'tgl lahir', 'lahir'].includes(h)) {
                obj.birthDate = formatImportDate(value)
            }
            else obj[h] = value
        })

        // Default role if missing
        if (!obj.role) obj.role = 'student'
        // Create username if missing
        if (!obj.username && obj.fullName) {
             obj.username = obj.fullName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
        }

        if (obj.fullName && obj.username) {
            result.push(obj)
        }
    }
    return result
}

const formatImportDate = (dateStr: string) => {
    if (!dateStr) return null
    // Support DD/MM/YYYY or DD-MM-YYYY
    const parts = dateStr.split(/[/-]/)
    if (parts.length === 3) {
        let d, m, y
        if (parts[2] && parts[2].length === 4) { // DD/MM/YYYY
            d = parts[0]
            m = parts[1]
            y = parts[2]
        } else if (parts[0] && parts[0].length === 4) { // YYYY/MM/DD
            y = parts[0]
            m = parts[1]
            d = parts[2]
        } else {
            return dateStr // Try as is
        }
        
        if (y && m && d) {
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
        }
    }
    return dateStr
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

            <div class="flex gap-2 w-full sm:w-auto">
                <input 
                    type="file" 
                    ref="fileInput" 
                    class="hidden" 
                    accept=".csv,.txt,.xlsx,.xls"
                    @change="processFile"
                />
                
                <button 
                    @click="triggerImport"
                    :disabled="isImporting"
                    class="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors w-full sm:w-auto justify-center whitespace-nowrap disabled:opacity-50"
                >
                    {{ isImporting ? 'Importing...' : 'Import Account' }}
                    <FileUp class="w-4 h-4" />
                </button>

                <button 
                    @click="downloadTemplate"
                    class="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors w-full sm:w-auto justify-center whitespace-nowrap"
                >
                    Template
                    <Download class="w-4 h-4" />
                </button>
                
                <button 
                    @click="handleCreate"
                    class="bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg shadow-[#4FD1C5]/20 w-full sm:w-auto justify-center whitespace-nowrap"
                >
                    Create Account
                    <Plus class="w-4 h-4" />
                </button>
            </div>
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
                        v-for="page in visiblePages" 
                        :key="page"
                        @click="typeof page === 'number' && (currentPage = page)"
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

    <!-- Import Preview Modal -->
    <AccountImportPreviewModal 
        :is-open="isImportPreviewOpen"
        :data="importData"
        :is-importing="isImporting"
        @close="isImportPreviewOpen = false"
        @confirm="confirmImport"
    />

    <Toast 
        :show="showToast" 
        :message="toastMessage" 
        :type="toastType"
        @close="showToast = false"
    />
  </div>
</template>
