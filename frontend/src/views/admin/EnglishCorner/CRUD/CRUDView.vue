<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../../components/Sidebar.vue'
import Header from '../../components/Header.vue'
import { Upload, Plus, Trash2 } from 'lucide-vue-next'
import Toast from '../../../../components/Toast.vue'

const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => route.path.includes('/edit'))
const articleId = computed(() => route.params.id)

// Toast State
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
}

// Form State
const title = ref('')
const description = ref('')
const image = ref('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop') // Default Mock Image
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const previewImage = ref<string | null>(null)
const intro = ref<string[]>([''])
const sections = ref<{ title: string; text: string }[]>([
    { title: '', text: '' }
])

// Actions
const addIntro = () => intro.value.push('')
const removeIntro = (index: number) => intro.value.splice(index, 1)

const addSection = () => sections.value.push({ title: '', text: '' })
const removeSection = (index: number) => sections.value.splice(index, 1)

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    // Show local preview
    previewImage.value = URL.createObjectURL(file)
    
    // Upload to Cloudinary
    await uploadToCloudinary(file)
}

const uploadToCloudinary = async (file: File) => {
    isUploading.value = true
    const formData = new FormData()
    formData.append('image', file) // Backend expects 'image' field

    try {
        const response = await fetch(
            `http://localhost:3001/api/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )

        if (!response.ok) throw new Error('Upload failed')

        const data = await response.json()
        image.value = data.secure_url
        showNotification('Image uploaded successfully', 'success')
    } catch (error) {
        console.error('Error uploading image:', error)
        showNotification('Failed to upload image', 'error')
    } finally {
        isUploading.value = false
    }
}

const fetchArticle = async () => {
    if (!isEditMode.value) return
    try {
        const response = await fetch(`http://localhost:3001/api/articles/${articleId.value}`)
        if (!response.ok) throw new Error('Failed to fetch article')
        const data = await response.json()
        
        title.value = data.title
        description.value = data.description
        image.value = data.image

        // Handle JSON fields that might be returned as strings
        let parsedIntro = data.intro
        if (typeof parsedIntro === 'string') {
            try { parsedIntro = JSON.parse(parsedIntro) } catch (e) { console.error('Error parsing intro', e) }
        }

        let parsedSections = data.sections
        if (typeof parsedSections === 'string') {
            try { parsedSections = JSON.parse(parsedSections) } catch (e) { console.error('Error parsing sections', e) }
        }
        
        // Default to empty array if null
        intro.value = Array.isArray(parsedIntro) ? parsedIntro : ['']
        sections.value = Array.isArray(parsedSections) ? parsedSections : [{ title: '', text: '' }]
    } catch (error) {
        console.error('Error fetching article:', error)
    }
}

const handleCancel = () => {
    router.back()
}

const handlePublish = async () => {
    const payload = {
        title: title.value,
        description: description.value,
        image: image.value,
        intro: intro.value.filter(i => i.trim() !== ''),
        sections: sections.value.filter(s => s.title.trim() !== '' || s.text.trim() !== '')
    }

    try {
        const url = isEditMode.value 
            ? `http://localhost:3001/api/articles/${articleId.value}`
            : 'http://localhost:3001/api/articles'
        
        const method = isEditMode.value ? 'PUT' : 'POST'

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (!response.ok) throw new Error('Failed to save article')
        
        showNotification(isEditMode.value ? 'Article updated successfully' : 'Article published successfully', 'success')
        
        // Wait for toast before redirect
        setTimeout(() => {
            router.push('/admin/english-corner')
        }, 1500)
    } catch (error) {
        console.error('Error saving article:', error)
        showNotification('Failed to save article', 'error')
    }
}

onMounted(() => {
    fetchArticle()
})
</script>

<template>
  <div class="min-h-screen bg-white font-poppins">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="pl-64">
      <Header />
      
      <main class="p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">
            {{ isEditMode ? 'Edit Article' : 'Create Article' }}
        </h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
            <!-- Left: Main Form -->
            <div class="lg:col-span-2 space-y-6">
                
                <!-- Title -->
                <div>
                    <label class="block text-gray-700 text-sm font-medium mb-2">
                        Title<span class="text-red-500">*</span>
                    </label>
                    <input 
                        v-model="title"
                        type="text" 
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 focus:border-[#4FD1C5]"
                        placeholder="Article Title"
                    >
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-gray-700 text-sm font-medium mb-2">
                        Short Description (for card)<span class="text-red-500">*</span>
                    </label>
                    <textarea 
                        v-model="description"
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 focus:border-[#4FD1C5] h-24 resize-none"
                        placeholder="Brief summary..."
                    ></textarea>
                </div>

                <!-- Intro Paragraphs -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-gray-700 text-sm font-medium">
                            Introduction Paragraphs
                        </label>
                        <button @click="addIntro" class="text-xs text-[#4FD1C5] font-medium hover:underline">+ Add Paragraph</button>
                    </div>
                    <div class="space-y-3">
                        <div v-for="(text, index) in intro" :key="index" class="flex gap-2">
                            <textarea 
                                v-model="intro[index]"
                                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 focus:border-[#4FD1C5] min-h-[80px]"
                                placeholder="Introductory text..."
                            ></textarea>
                            <button @click="removeIntro(index)" class="text-red-400 hover:text-red-600 self-start mt-2">
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Sections -->
                <div>
                    <div class="flex justify-between items-center mb-4">
                        <label class="block text-gray-700 text-sm font-medium">
                            Article Sections
                        </label>
                        <button 
                            @click="addSection" 
                            class="flex items-center gap-1 text-xs bg-[#4FD1C5] text-white px-2 py-1 rounded hover:bg-[#3dbdb0]"
                        >
                            <Plus class="w-3 h-3" /> Add Section
                        </button>
                    </div>
                    
                    <div class="space-y-6">
                        <div v-for="(section, index) in sections" :key="index" class="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
                            <button 
                                @click="removeSection(index)" 
                                class="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                            
                            <div class="mb-3">
                                <label class="block text-xs font-medium text-gray-500 mb-1">Section Title</label>
                                <input 
                                    v-model="section.title"
                                    type="text" 
                                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4FD1C5]"
                                    placeholder="e.g. 1. Use Interactive Apps"
                                >
                            </div>
                            
                            <div>
                                <label class="block text-xs font-medium text-gray-500 mb-1">Content</label>
                                <textarea 
                                    v-model="section.text"
                                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4FD1C5] min-h-[100px]"
                                    placeholder="Section content..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Right: Thumbnail Upload -->
            <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">
                    Thumbnail Image<span class="text-red-500">*</span>
                </label>
                
                <input 
                    ref="fileInput"
                    type="file" 
                    accept="image/*"
                    class="hidden"
                    @change="handleFileUpload"
                >

                <div 
                    @click="triggerFileInput"
                    class="relative cursor-pointer group"
                >
                    <div v-if="image || previewImage" class="border border-gray-200 rounded-lg overflow-hidden shadow-sm aspect-video relative">
                        <img :src="previewImage || image" alt="Preview" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                            <Upload class="w-8 h-8 mb-2" />
                            <p class="text-sm font-medium">Change Image</p>
                        </div>
                    </div>
                    
                    <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center text-gray-400 aspect-video hover:border-[#4FD1C5] hover:text-[#4FD1C5] transition-all">
                        <Upload class="w-8 h-8 mb-2" />
                        <p class="text-sm font-medium">Click to upload thumbnail</p>
                        <p class="text-xs mt-1">PNG, JPG up to 5MB</p>
                    </div>

                    <!-- Loading Overlay -->
                    <div v-if="isUploading" class="absolute inset-0 bg-white/80 rounded-lg flex flex-col items-center justify-center z-10">
                        <div class="w-8 h-8 border-4 border-[#4FD1C5] border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p class="text-xs font-semibold text-gray-600">Uploading...</p>
                    </div>
                </div>

                <p v-if="image && !previewImage" class="text-[10px] text-gray-400 mt-2 truncate max-w-full">
                    Current URL: {{ image }}
                </p>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 border-t border-gray-100 pt-6">
            <button 
                @click="handleCancel"
                class="px-6 bg-white border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                @click="handlePublish"
                class="px-8 bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white font-medium py-3 rounded-lg shadow-sm shadow-[#4FD1C5]/30 transition-all ml-auto"
            >
                {{ isEditMode ? 'Save Changes' : 'Publish Article' }}
            </button>
        </div>

    </main>
    <Toast 
        :show="showToast"
        :message="toastMessage"
        :type="toastType"
        @close="showToast = false"
    />
    </div>
  </div>
</template>
