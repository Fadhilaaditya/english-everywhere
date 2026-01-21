<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { User, Edit, X } from 'lucide-vue-next'
import ConfirmationModal from './ConfirmationModal.vue'

const props = defineProps<{
  isOpen: boolean
  account?: any
}>()

const emit = defineEmits(['close', 'submit'])

const isEditMode = computed(() => !!props.account && Object.keys(props.account).length > 0)
const title = computed(() => isEditMode.value ? 'Edit Account' : 'Create Teacher Account')
const isLoading = ref(false)

const formData = ref({
    fullName: '',
    gender: 'Female',
    address: '',
    phone: '',
    email: '',
    birthDate: '',
    level: 'Intermediate (B1)',
    username: '',
    password: ''
})

// Initialize form when account changes
watch(() => props.account, (newVal) => {
    if (newVal && newVal.fullData) {
        // Edit mode - Fill data from DB
        const data = newVal.fullData
        formData.value = {
            fullName: data.name || '',
            gender: data.gender || 'Female',
            address: data.address || '',
            phone: data.phoneNumber || '',
            email: data.email || '',
            birthDate: data.birthDate || '',
            level: 'Intermediate (B1)', // Assuming level isn't in DB yet? Or mapping needed
            username: data.user ? data.user.username : '',
            password: '' // Don't fill password
        }
    } else {
        // Create mode or Reset
        formData.value = {
            fullName: '',
            gender: 'Female',
            address: '',
            phone: '',
            email: '',
            birthDate: '',
            level: 'Intermediate (B1)',
            username: '',
            password: ''
        }
    }
}, { immediate: true })

const isConfirmOpen = ref(false)

const handleSubmit = () => {
    if (!props.account) return
    isConfirmOpen.value = true
}

const processSubmission = async () => {
    isConfirmOpen.value = false // Close confirm modal
    isLoading.value = true
    try {
        const response = await fetch(`http://localhost:3001/api/students/${props.account.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData.value)
        })

        if (!response.ok) throw new Error('Failed to update account')
        
        emit('submit', formData.value)
        emit('close')
    } catch (e) {
        console.error('Error updating account:', e)
        // Let parent handle error toast if needed or emit error
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
    <div class="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="p-8">
            <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">{{ title }}</h2>

            <!-- Photo Upload -->
            <div class="flex flex-col items-center mb-8">
                <div class="w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
                    <User class="w-12 h-12 text-gray-400" />
                </div>
                <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Upload New Photo
                </button>
            </div>

            <!-- Form -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Full Name -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <div class="relative">
                        <input 
                            v-model="formData.fullName"
                            type="text" 
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                        />
                         <Edit class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <!-- Gender -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Gender</label>
                    <select 
                        v-model="formData.gender"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 bg-white"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <!-- Address (Full width) -->
                <div class="md:col-span-2 space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Alamat</label>
                    <div class="relative">
                        <textarea 
                            v-model="formData.address"
                            rows="2"
                            class="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 resize-none"
                        ></textarea>
                         <Edit class="absolute right-3 top-4 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <!-- Phone -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">No Telp</label>
                    <div class="relative">
                        <input 
                            v-model="formData.phone"
                            type="text" 
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                        />
                         <Edit class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <!-- Email -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <div class="relative">
                        <input 
                            v-model="formData.email"
                            type="email" 
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                        />
                         <Edit class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <!-- Birth Date -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                    <input 
                        v-model="formData.birthDate"
                        type="date" 
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>

                 <!-- Level -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Level</label>
                    <select 
                        v-model="formData.level"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 bg-white"
                    >
                        <option value="Intermediate (B1)">Intermediate (B1)</option>
                         <option value="Hi Kids!">Hi Kids!</option>
                        <option value="Get Smart">Get Smart</option>
                        <option value="Business English">Business English</option>
                    </select>
                </div>

                <!-- Username -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Username<span class="text-red-500">*</span></label>
                    <input 
                        v-model="formData.username"
                        type="text" 
                        placeholder="username"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>

                <!-- Password -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Password<span class="text-red-500">*</span></label>
                    <input 
                        v-model="formData.password"
                        type="password" 
                        placeholder="password"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>
            </div>

            <!-- Actions -->
            <div class="grid grid-cols-2 gap-4 mt-8 pt-4">
                <button 
                    @click="$emit('close')"
                    class="w-full px-4 py-3 rounded-lg border border-[#F4838D] text-[#F4838D] text-lg font-medium hover:bg-red-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    @click="handleSubmit"
                    :disabled="isLoading"
                    class="w-full px-4 py-3 rounded-lg bg-[#4FD1C5] text-white text-lg font-medium hover:bg-[#3dbdb0] transition-colors shadow-lg shadow-[#4FD1C5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Account') }}
                </button>
            </div>
        </div>
    </div>
    
    <ConfirmationModal 
        :is-open="isConfirmOpen"
        title="Save Changes"
        message="Are you sure you want to save these changes to the account?"
        confirm-text="Save"
        @close="isConfirmOpen = false"
        @confirm="processSubmission"
    />
  </div>
</template>
