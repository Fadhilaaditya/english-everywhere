<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Upload, Calendar, Clock, Image as ImageIcon, Trash2, X } from 'lucide-vue-next'
import Toast from '../../../../components/Toast.vue'

const props = defineProps<{
  isOpen: boolean
  event?: any
}>()

const emit = defineEmits(['close', 'success'])
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

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
    images: [] as string[],
    category: '',
    location: ''
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

    previewImage.value = URL.createObjectURL(file)
    await uploadToCloudinary(file)
}

const uploadToCloudinary = async (file: File) => {
    isUploading.value = true
    const formDataBody = new FormData()
    formDataBody.append('image', file)

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formDataBody,
        })

        if (!response.ok) throw new Error('Upload failed')

        const data = await response.json()
        formData.value.images.push(data.secure_url)
        if (!formData.value.image) {
            formData.value.image = data.secure_url
        }
        showNotification('Image uploaded successfully', 'success')
    } catch (error) {
        console.error('Error uploading image:', error)
        showNotification('Failed to upload poster', 'error')
        if (!formData.value.image) {
            previewImage.value = null
        }
    } finally {
        isUploading.value = false
    }
}

watch(() => props.event, (newVal) => {
    previewImage.value = null
    if (newVal) {
        formData.value = {
            title: newVal.title,
            price: newVal.price,
            desc: newVal.desc,
            date: newVal.date,
            time: newVal.time,
            image: newVal.image,
            images: (Array.isArray(newVal.images) && newVal.images.length > 0) 
                ? [...newVal.images] 
                : (newVal.image ? [newVal.image] : []),
            category: newVal.category,
            location: newVal.location || ''
        }
    } else {
        formData.value = {
            title: '',
            price: '',
            desc: '',
            date: '',
            time: '',
            image: '',
            images: [],
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
            ? `${API_URL}/events/${props.event.id}`
            : `${API_URL}/events`
        
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

const removeImage = (index: number) => {
    formData.value.images.splice(index, 1)
    const firstImage = formData.value.images[0]
    formData.value.image = firstImage || ''
    showNotification('Image removed', 'success')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 md:p-10 transition-all duration-300 transform scale-100">
        
        <div class="flex justify-between items-center mb-6 md:mb-10">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900">{{ title }}</h2>
          <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900">
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
            <!-- Left Column: Upload Poster -->
            <div class="md:col-span-5 lg:col-span-4">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Event Images<span class="text-red-500 ml-1">*</span></label>
                
                <input 
                    ref="fileInput"
                    type="file" 
                    accept="image/*"
                    class="hidden"
                    @change="handleFileUpload"
                >

                <div class="grid grid-cols-3 md:grid-cols-2 gap-3 mb-4">
                    <div 
                        v-for="(img, index) in formData.images" 
                        :key="index"
                        class="relative aspect-[3/4] rounded-xl overflow-hidden group border border-gray-100 shadow-sm"
                    >
                        <img :src="img" alt="Preview" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                @click="removeImage(index)"
                                class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-110 active:scale-95"
                                title="Remove Image"
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                        <div v-if="index === 0" class="absolute top-1.5 left-1.5 bg-[#4FD1C5] text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-md uppercase tracking-wider">
                            Main
                        </div>
                    </div>

                    <!-- Add Image Button -->
                    <div 
                        v-if="formData.images.length < 5"
                        @click="triggerFileInput"
                        class="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-[#4FD1C5] hover:text-[#4FD1C5] transition-all cursor-pointer group bg-gray-50/50"
                    >
                        <Upload class="w-6 h-6 text-gray-400 group-hover:text-[#4FD1C5] mb-2 pointer-events-none" />
                        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-[#4FD1C5] pointer-events-none">Add Image</span>
                    </div>
                </div>

                <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p class="text-[10px] text-gray-500 leading-relaxed font-medium">
                        Max 5 images. JPG, PNG formats up to 5 MB. The first image automatically becomes the primary poster shown in lists.
                    </p>
                </div>

                <!-- Loading Overlay (Progress indicator) -->
                <div v-if="isUploading" class="mt-4 flex items-center gap-3 p-4 bg-[#4FD1C5]/5 rounded-xl border border-[#4FD1C5]/10 animate-pulse">
                    <div class="w-5 h-5 border-2 border-[#4FD1C5] border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-xs font-bold text-[#4FD1C5] uppercase tracking-wider">Uploading...</p>
                </div>
            </div>

            <!-- Right Column: Form Fields -->
            <div class="md:col-span-7 lg:col-span-8 space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <!-- Title -->
                    <div class="sm:col-span-1 space-y-1.5">
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Title<span class="text-red-500 ml-1">*</span></label>
                        <input 
                            v-model="formData.title"
                            type="text" 
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/10 focus:border-[#4FD1C5] transition-all shadow-sm"
                            placeholder="Event Title"
                        />
                    </div>

                    <!-- Price -->
                    <div class="sm:col-span-1 space-y-1.5">
                         <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Price<span class="text-red-500 ml-1">*</span></label>
                        <input 
                            v-model="formData.price"
                            type="text" 
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/10 focus:border-[#4FD1C5] transition-all shadow-sm"
                            placeholder="e.g. Free or Rp. 50.000"
                        />
                    </div>
                </div>

                <!-- Description -->
                <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Description<span class="text-red-500 ml-1">*</span></label>
                    <textarea 
                        v-model="formData.desc"
                        rows="4"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/10 focus:border-[#4FD1C5] resize-none transition-all shadow-sm"
                        placeholder="Detail about the event..."
                    ></textarea>
                </div>

                <!-- Date & Time -->
                 <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div class="space-y-1.5">
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Date<span class="text-red-500 ml-1">*</span></label>
                         <div class="relative">
                            <input 
                                v-model="formData.date"
                                type="date"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/10 focus:border-[#4FD1C5] transition-all shadow-sm"
                            />
                        </div>
                    </div>
                     <div class="space-y-1.5">
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Time<span class="text-red-500 ml-1">*</span></label>
                        <div class="relative">
                             <input 
                                v-model="formData.time"
                                type="text"
                                placeholder="19.00 - 20.30 WIB"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/10 focus:border-[#4FD1C5] transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <!-- Location -->
                <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Location<span class="text-red-500 ml-1">*</span></label>
                    <input 
                        v-model="formData.location"
                        type="text"
                        placeholder="e.g. Google Meet or Meeting Room"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/10 focus:border-[#4FD1C5] transition-all shadow-sm"
                    />
                </div>
            </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 mt-10 md:mt-12">
            <button 
                @click="$emit('close')"
                class="px-10 py-3.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
            >
                Cancel
            </button>
            <button 
                @click="handleSubmit"
                class="px-12 py-3.5 rounded-xl bg-[#4FD1C5] text-white text-sm font-bold hover:bg-[#3dbdb0] transition-all active:scale-95 shadow-lg shadow-[#4FD1C5]/20"
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
