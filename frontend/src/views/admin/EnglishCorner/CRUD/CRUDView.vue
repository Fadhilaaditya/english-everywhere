<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../../components/Sidebar.vue'
import Header from '../../components/Header.vue'
import { 
    Upload, 
    Type, 
    Bold, 
    Italic, 
    Underline, 
    List, 
    AlignLeft, 
    Image as ImageIcon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => route.path.includes('/edit'))
const title = ref('')
const content = ref('')

const handleCancel = () => {
    router.back()
}

const handlePublish = () => {
    // Navigate back to list
    router.push('/admin/english-corner')
}
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
            <!-- Left: Title Form -->
            <div class="lg:col-span-2">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-medium mb-2">
                        Title<span class="text-red-500">*</span>
                    </label>
                    <input 
                        v-model="title"
                        type="text" 
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 focus:border-[#4FD1C5] h-[52px]"
                    >
                </div>
            </div>

            <!-- Right: Thumbnail Upload -->
            <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">
                    Thumbnail<span class="text-red-500">*</span>
                </label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors h-[120px]">
                    <Upload class="w-6 h-6 text-gray-400 mb-2" />
                    <p class="text-xs text-gray-500 font-medium">Choose a file or drag & drop it here</p>
                    <p class="text-[10px] text-gray-400 mt-1">JPEG, PNG, PDF formats, up to 5 MB.</p>
                </div>
            </div>
        </div>

        <!-- Toolbar & Content -->
        <div class="mb-8">
            <!-- Toolbar -->
            <div class="flex items-center gap-4 mb-4">
                <button class="text-gray-600 hover:text-gray-900"><Type class="w-5 h-5" /></button>
                <button class="text-gray-600 hover:text-gray-900"><Bold class="w-5 h-5" /></button>
                <button class="text-gray-600 hover:text-gray-900"><Italic class="w-5 h-5" /></button>
                <button class="text-gray-600 hover:text-gray-900"><Underline class="w-5 h-5" /></button>
                <button class="text-gray-600 hover:text-gray-900"><List class="w-5 h-5" /></button>
                <button class="text-gray-600 hover:text-gray-900"><List class="w-5 h-5" /></button>
                <button class="text-gray-600 hover:text-gray-900"><AlignLeft class="w-5 h-5" /></button>
                <button class="text-gray-600 hover:text-gray-900"><ImageIcon class="w-5 h-5" /></button>
            </div>

            <div class="mb-2">
                <label class="block text-gray-700 text-sm font-medium mb-2">
                    Content<span class="text-red-500">*</span>
                </label>
                <textarea 
                    v-model="content"
                    class="w-full border border-gray-300 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 focus:border-[#4FD1C5] min-h-[400px] resize-y"
                ></textarea>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
            <button 
                @click="handleCancel"
                class="w-1/2 bg-white border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                @click="handlePublish"
                class="w-1/2 bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white font-medium py-3 rounded-lg shadow-sm shadow-[#4FD1C5]/30 transition-all"
            >
                {{ isEditMode ? 'Save' : 'Publish' }}
            </button>
        </div>

      </main>
    </div>
  </div>
</template>
