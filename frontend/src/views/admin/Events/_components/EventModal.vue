<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Upload, Calendar, Clock } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  event?: any
}>()

const emit = defineEmits(['close', 'submit'])

const formData = ref({
    title: '',
    price: '',
    desc: '',
    date: '',
    time: '',
    image: '',
    category: ''
})

const isEditMode = computed(() => !!props.event)
const title = computed(() => isEditMode.value ? 'Edit Events' : 'Create Events')
const submitButtonText = computed(() => isEditMode.value ? 'Save' : 'Submit')

watch(() => props.event, (newVal) => {
    if (newVal) {
        // Edit mode
        formData.value = {
            title: newVal.title,
            price: newVal.price,
            desc: newVal.desc, // Model uses 'desc'
            date: newVal.date,
            time: newVal.time,
            image: newVal.image,
            category: newVal.category
        }
    } else {
        // Create mode
        formData.value = {
            title: '',
            price: '',
            desc: '',
            date: '',
            time: '',
            image: '/class1.svg', // Default for now
            category: ''
        }
    }
}, { immediate: true })

const handleSubmit = () => {
    emit('submit', formData.value)
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
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 h-[400px] flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                    <Upload class="w-8 h-8 text-gray-400 group-hover:text-gray-600 mb-3" />
                    <p class="text-sm font-medium text-gray-900">Choose a file or drag & drop it here</p>
                    <p class="text-xs text-gray-500 mt-1">JPG, PNG, JPEG formats up to 5 MB.</p>
                    <button class="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-white transition-colors">
                        Browse File
                    </button>
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
                            <!-- Custom icon overlay if needed, sticking to native for simplicity unless refined -->
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
  </div>
</template>
