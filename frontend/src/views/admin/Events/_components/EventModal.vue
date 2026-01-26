<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Upload, Calendar, Clock, Image as ImageIcon } from 'lucide-vue-next'
import Toast from '../../../../components/Toast.vue'

const props = defineProps<{
  isOpen: boolean
  event?: any
}>()

const emit = defineEmits(['close', 'success'])

// Toast State
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
}

const formData = ref({
    title: '',
    price: '',
    desc: '',
    date: '',
    time: '',
    image: '',
    category: '',
    location: '' // Added location as seen in EventTable
})

const isEditMode = computed(() => !!props.event)
const title = computed(() => isEditMode.value ? 'Edit Events' : 'Create Events')
const submitButtonText = computed(() => isEditMode.value ? 'Save' : 'Submit')

const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const previewImage = ref<string | null>(null)

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    // Show local preview
    previewImage.value = URL.createObjectURL(file)
    
    // Upload to our backend
    await uploadToCloudinary(file)
}

const uploadToCloudinary = async (file: File) => {
    isUploading.value = true
    const formDataBody = new FormData()
    formDataBody.append('image', file)

    try {
        const response = await fetch(
            `http://localhost:3001/api/upload`,
            {
                method: 'POST',
                body: formDataBody,
            }
        )

        if (!response.ok) throw new Error('Upload failed')

        const data = await response.json()
        formData.value.image = data.secure_url
        showNotification('Poster uploaded successfully', 'success')
    } catch (error) {
        console.error('Error uploading image:', error)
        showNotification('Failed to upload poster', 'error')
        // Revert preview if upload failed and we don't have a previous image
        if (!formData.value.image) {
            previewImage.value = null
        }
    } finally {
        isUploading.value = false
    }
}

watch(() => props.event, (newVal) => {
    previewImage.value = null // Reset preview on event change
    if (newVal) {
        // Edit mode
        formData.value = {
            title: newVal.title,
            price: newVal.price,
            desc: newVal.desc,
            date: newVal.date,
            time: newVal.time,
            image: newVal.image,
            category: newVal.category,
            location: newVal.location || ''
        }
    } else {
        // Create mode
        formData.value = {
            title: '',
            price: '',
            desc: '',
            date: '',
            time: '',
            image: '',
            category: '',
            location: ''
        }
    }
}, { immediate: true })

const handleSubmit = async () => {
    if (!formData.value.title || !formData.value.image) {
        showNotification('Title and Poster are required', 'error')
        return
    }

    try {
        const url = isEditMode.value 
            ? `http://localhost:3001/api/events/${props.event.id}`
            : 'http://localhost:3001/api/events'
        
        const method = isEditMode.value ? 'PUT' : 'POST'

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData.value)
        })

        if (!response.ok) throw new Error('Failed to save event')
        
        const successMessage = isEditMode.value ? 'Event updated successfully' : 'Event created successfully'
        emit('success', successMessage)
    } catch (error) {
        console.error('Error saving event:', error)
        showNotification('Failed to save event', 'error')
    }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 min-w-[700px]">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl p-8">
        
        <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">{{ title }}</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Left Column: Upload Poster -->
            <div class="md:col-span-1">
                <label class="block text-sm font-medium text-gray-700 mb-2">Upload Poster<span class="text-red-500">*</span></label>
                
                <input 
                    ref="fileInput"
                    type="file" 
                    accept="image/*"
                    class="hidden"
                    @change="handleFileUpload"
                >

                <div 
                    @click="triggerFileInput"
                    class="relative border-2 border-dashed border-gray-300 rounded-lg h-[400px] flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group overflow-hidden"
                >
                    <div v-if="formData.image || previewImage" class="w-full h-full relative group">
                        <img :src="previewImage || formData.image" alt="Preview" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                            <Upload class="w-8 h-8 mb-2" />
                            <p class="text-sm font-medium">Click to change poster</p>
                        </div>
                    </div>
                    
                    <div v-else class="p-6 flex flex-col items-center justify-center">
                        <Upload class="w-8 h-8 text-gray-400 group-hover:text-gray-600 mb-3" />
                        <p class="text-sm font-medium text-gray-900 leading-snug">Choose a file or drag & drop it here</p>
                        <p class="text-xs text-gray-500 mt-2">JPG, PNG, JPEG formats up to 5 MB.</p>
                        <button class="mt-6 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                            Browse File
                        </button>
                    </div>

                    <!-- Loading Overlay -->
                    <div v-if="isUploading" class="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 transition-opacity">
                        <div class="w-10 h-10 border-4 border-[#4FD1C5] border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p class="text-sm font-semibold text-gray-700">Uploading...</p>
                    </div>
                </div>
            </div>

            <!-- Right Column: Form Fields -->
            <div class="md:col-span-2 space-y-5">
                <div class="grid grid-cols-2 gap-4">
                    <!-- Title -->
                    <div class="col-span-2 md:col-span-1 space-y-1">
                        <label class="block text-sm font-medium text-gray-700">Title<span class="text-red-500">*</span></label>
                        <input 
                            v-model="formData.title"
                            type="text" 
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                        />
                    </div>

                    <!-- Price -->
                    <div class="col-span-2 md:col-span-1 space-y-1">
                         <label class="block text-sm font-medium text-gray-700">Price<span class="text-red-500">*</span></label>
                        <input 
                            v-model="formData.price"
                            type="text" 
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                        />
                    </div>
                </div>

                <!-- Description -->
                <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700">Description<span class="text-red-500">*</span></label>
                    <textarea 
                        v-model="formData.desc"
                        rows="4"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 resize-none"
                    ></textarea>
                </div>



                <!-- Date & Time -->
                 <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-700">Date<span class="text-red-500">*</span></label>
                         <div class="relative">
                            <input 
                                v-model="formData.date"
                                type="date"
                                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                            />
                        </div>
                    </div>
                     <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-700">Time<span class="text-red-500">*</span></label>
                        <div class="relative">
                             <input 
                                v-model="formData.time"
                                type="text"
                                placeholder="19.00 - 20.30 WIB"
                                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                            />
                        </div>
                    </div>
                </div>

                <!-- Location -->
                <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700">Location<span class="text-red-500">*</span></label>
                    <input 
                        v-model="formData.location"
                        type="text"
                        placeholder="e.g. Google Meet"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>
            </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-center gap-4 mt-10">
            <button 
                @click="$emit('close')"
                class="px-12 py-3 rounded-lg border border-red-500 text-red-500 text-lg font-medium hover:bg-red-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                @click="handleSubmit"
                class="px-12 py-3 rounded-lg bg-[#4FD1C5] text-white text-lg font-medium hover:bg-[#3dbdb0] transition-colors shadow-lg shadow-[#4FD1C5]/30"
            >
                {{ submitButtonText }}
            </button>
        </div>

    </div>
    <Toast 
        :show="showToast"
        :message="toastMessage"
        :type="toastType"
        @close="showToast = false"
    />
  </div>
</template>
