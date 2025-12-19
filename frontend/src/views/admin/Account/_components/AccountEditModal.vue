<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { User, Edit, X } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  account?: any
}>()

const emit = defineEmits(['close', 'submit'])

const isEditMode = computed(() => !!props.account && Object.keys(props.account).length > 0)
const title = computed(() => isEditMode.value ? 'Edit Account' : 'Create Teacher Account')

const formData = ref({
    fullName: '',
    gender: 'Female',
    address: '',
    phone: '',
    email: '',
    birthDate: '',
    level: '',
    username: '',
    password: ''
})

// Initialize form when account changes
watch(() => props.account, (newVal) => {
    if (newVal) {
        // Edit mode - Mock filling data based on the account passed
        formData.value = {
            fullName: newVal.name || 'Sarah Gunawan',
            gender: 'Female', // Mock
            address: 'Jl. Cendrawasih No. 22, Kel. Petojo Utara, Kec. Gambir, Kota Jakarta Pusat, DKI Jakarta 10160',
            phone: '+62 811 2233 4455',
            email: 'sarah.gunawan@gmail.com',
            birthDate: '1995-02-10', // 10/02/1995
            level: 'Intermediate (B1)',
            username: newVal.username || '',
            password: 'password' // Mock
        }
    } else {
        // Create mode - Reset or default
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

const handleSubmit = () => {
    emit('submit', formData.value)
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
                    class="w-full px-4 py-3 rounded-lg bg-[#4FD1C5] text-white text-lg font-medium hover:bg-[#3dbdb0] transition-colors shadow-lg shadow-[#4FD1C5]/30"
                >
                    {{ isEditMode ? 'Save Changes' : 'Create Account' }}
                </button>
            </div>
        </div>
    </div>
  </div>
</template>
