<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../../components/Sidebar.vue'
import Header from '../../components/Header.vue'
import { Upload, Plus, Trash2 } from 'lucide-vue-next'
import Toast from '../../../../components/Toast.vue'

const route = useRoute()
const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const isEditMode = computed(() => route.path.includes('/edit'))
const articleId = computed(() => route.params.id)
const isSidebarOpen = ref(false)

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
const image = ref('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop')
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

    previewImage.value = URL.createObjectURL(file)
    await uploadToCloudinary(file)
}

const uploadToCloudinary = async (file: File) => {
    isUploading.value = true
    const formData = new FormData()
    formData.append('image', file)

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
        })

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
        const response = await fetch(`${API_URL}/articles/${articleId.value}`)
        if (!response.ok) throw new Error('Failed to fetch article')
        const data = await response.json()
        
        title.value = data.title
        description.value = data.description
        image.value = data.image

        let parsedIntro = data.intro
        if (typeof parsedIntro === 'string') {
            try { parsedIntro = JSON.parse(parsedIntro) } catch (e) { console.error('Error parsing intro', e) }
        }

        let parsedSections = data.sections
        if (typeof parsedSections === 'string') {
            try { parsedSections = JSON.parse(parsedSections) } catch (e) { console.error('Error parsing sections', e) }
        }
        
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
            ? `${API_URL}/articles/${articleId.value}`
            : `${API_URL}/articles`
        
        const method = isEditMode.value ? 'PUT' : 'POST'

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (!response.ok) throw new Error('Failed to save article')
        
        showNotification(isEditMode.value ? 'Article updated successfully' : 'Article published successfully', 'success')
        
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
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Main Content -->
    <div class="transition-all duration-300 lg:pl-64">
      <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      
      <main class="p-4 lg:p-8 max-w-7xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">
            {{ isEditMode ? 'Edit Article' : 'Create Article' }}
        </h1>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-6">
            <!-- Left: Main Form -->
            <div class="xl:col-span-2 space-y-6 md:space-y-8">
                
                <!-- Title -->
                <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                        Title<span class="text-red-500">*</span>
                    </label>
                    <input 
                        v-model="title"
                        type="text" 
                        class="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/10 focus:border-[#4FD1C5] transition-all"
                        placeholder="Article Title"
                    >
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                        Short Description (for card)<span class="text-red-500">*</span>
                    </label>
                    <textarea 
                        v-model="description"
                        class="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/10 focus:border-[#4FD1C5] h-28 resize-none transition-all"
                        placeholder="Brief summary..."
                    ></textarea>
                </div>

                <!-- Thumbnail Upload (Only visible on Mobile here) -->
                <div class="xl:hidden">
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                        Thumbnail Image<span class="text-red-500">*</span>
                    </label>
                    <div 
                        @click="triggerFileInput"
                        class="relative cursor-pointer group"
                    >
                        <div v-if="image || previewImage" class="border border-gray-200 rounded-xl overflow-hidden shadow-sm aspect-video relative">
                            <img :src="previewImage || image" alt="Preview" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                <Upload class="w-8 h-8 mb-2" />
                                <p class="text-sm font-medium">Change Image</p>
                            </div>
                        </div>
                        
                        <div v-else class="border-2 border-dashed border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center text-center text-gray-400 aspect-video hover:border-[#4FD1C5] hover:text-[#4FD1C5] transition-all bg-gray-50/50">
                            <Upload class="w-8 h-8 mb-2" />
                            <p class="text-sm font-medium">Click to upload thumbnail</p>
                        </div>

                        <!-- Loading Overlay -->
                        <div v-if="isUploading" class="absolute inset-0 bg-white/80 rounded-xl flex flex-col items-center justify-center z-10 transition-all">
                            <div class="w-8 h-8 border-4 border-[#4FD1C5] border-t-transparent rounded-full animate-spin mb-2 transition-all"></div>
                            <p class="text-xs font-semibold text-gray-600">Uploading...</p>
                        </div>
                    </div>
                </div>

                <!-- Intro Paragraphs -->
                <div>
                    <div class="flex justify-between items-center mb-3">
                        <label class="block text-gray-700 text-sm font-semibold">
                            Introduction Paragraphs
                        </label>
                        <button @click="addIntro" class="text-xs text-[#4FD1C5] font-bold hover:text-[#3dbdb0] transition-colors">+ Add Paragraph</button>
                    </div>
                    <div class="space-y-4">
                        <div v-for="(text, index) in intro" :key="index" class="flex gap-3">
                            <textarea 
                                v-model="intro[index]"
                                class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/10 focus:border-[#4FD1C5] min-h-[100px] transition-all"
                                placeholder="Introductory text..."
                            ></textarea>
                            <button @click="removeIntro(index)" class="text-gray-300 hover:text-red-500 transition-colors self-start mt-3">
                                <Trash2 class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Sections -->
                <div>
                    <div class="flex justify-between items-center mb-4">
                        <label class="block text-gray-700 text-sm font-semibold">
                            Article Sections
                        </label>
                        <button 
                            @click="addSection" 
                            class="flex items-center gap-2 text-xs bg-[#4FD1C5] text-white px-3 py-2 rounded-lg hover:bg-[#3dbdb0] font-bold transition-all active:scale-95 shadow-lg shadow-[#4FD1C5]/10"
                        >
                            <Plus class="w-3 h-3" /> Add Section
                        </button>
                    </div>
                    
                    <div class="space-y-6">
                        <div v-for="(section, index) in sections" :key="index" class="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 relative group transition-all">
                            <button 
                                @click="removeSection(index)" 
                                class="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 class="w-5 h-5" />
                            </button>
                            
                            <div class="mb-4">
                                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Section Title</label>
                                <input 
                                    v-model="section.title"
                                    type="text" 
                                    class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#4FD1C5] bg-white transition-all shadow-sm"
                                    placeholder="e.g. 1. Use Interactive Apps"
                                >
                            </div>
                            
                            <div>
                                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Content</label>
                                <textarea 
                                    v-model="section.text"
                                    class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#4FD1C5] min-h-[120px] bg-white transition-all shadow-sm"
                                    placeholder="Section content..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Right: Thumbnail Upload (Desktop only) -->
            <div class="hidden xl:block">
                <div class="sticky top-8">
                    <label class="block text-gray-700 text-sm font-semibold mb-3">
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
                        <div v-if="image || previewImage" class="border border-gray-100 rounded-3xl overflow-hidden shadow-xl aspect-video relative">
                            <img :src="previewImage || image" alt="Preview" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                <Upload class="w-10 h-10 mb-2" />
                                <p class="text-sm font-bold uppercase tracking-wider">Change Image</p>
                            </div>
                        </div>
                        
                        <div v-else class="border-2 border-dashed border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center text-gray-400 aspect-video hover:border-[#4FD1C5] hover:text-[#4FD1C5] transition-all bg-gray-50/50">
                            <Upload class="w-10 h-10 mb-3" />
                            <p class="text-sm font-bold uppercase tracking-wider">Upload Thumbnail</p>
                            <p class="text-xs mt-2 font-medium">PNG, JPG up to 5MB</p>
                        </div>

                        <!-- Loading Overlay -->
                        <div v-if="isUploading" class="absolute inset-0 bg-white/90 rounded-3xl flex flex-col items-center justify-center z-10 transition-all">
                            <div class="w-10 h-10 border-4 border-[#4FD1C5] border-t-transparent rounded-full animate-spin mb-3 transition-all"></div>
                            <p class="text-xs font-bold text-gray-600 uppercase tracking-widest">Uploading...</p>
                        </div>
                    </div>

                    <div class="mt-6 p-6 border border-[#4FD1C5]/10 bg-[#4FD1C5]/5 rounded-2xl">
                        <h4 class="text-sm font-bold text-[#4FD1C5] mb-2 uppercase tracking-wider">Pro-Tip</h4>
                        <p class="text-xs text-[#4FD1C5]/80 leading-relaxed font-medium">
                            Use high-quality landscape images (16:9) for the best look on the homepage.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 border-t border-gray-100 pt-8 mt-4 mb-12">
            <button 
                @click="handleCancel"
                class="px-8 bg-white border border-gray-200 text-gray-500 font-bold py-3.5 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
            >
                Cancel
            </button>
            <button 
                @click="handlePublish"
                class="px-10 bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#4FD1C5]/20 transition-all active:scale-95 sm:ml-auto"
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
