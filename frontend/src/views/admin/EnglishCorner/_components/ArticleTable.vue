<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'
import Toast from '../../../../components/Toast.vue'

const router = useRouter()
const articles = ref<any[]>([])

// Toast State
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
}

const fetchArticles = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/articles')
        if (!response.ok) throw new Error('Failed to fetch articles')
        articles.value = await response.json()
    } catch (error) {
        console.error('Error fetching articles:', error)
    }
}

const handleCreate = () => {
    router.push('/admin/english-corner/create')
}

const handleEdit = (id: number) => {
    router.push(`/admin/english-corner/edit/${id}`)
}

const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
        const response = await fetch(`http://localhost:3001/api/articles/${id}`, {
            method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete article')
        await fetchArticles()
        showNotification('Article deleted successfully', 'success')
    } catch (error) {
        console.error('Error deleting article:', error)
        showNotification('Failed to delete article', 'error')
    }
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

onMounted(() => {
    fetchArticles()
})
</script>

<template>
  <div class="bg-white rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-bold text-gray-900">List Articles</h2>
        <button 
            @click="handleCreate"
            class="bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
            Create Article
            <Plus class="w-4 h-4" />
        </button>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full">
            <thead>
                <tr class="border-b border-gray-100 text-left">
                    <th class="py-4 px-4 font-medium text-gray-900 w-1/3">Title</th>
                    <th class="py-4 px-4 font-medium text-gray-900 w-1/3">Description</th>
                    <th class="py-4 px-4 font-medium text-gray-900">Date Created</th>
                    <th class="py-4 px-4 font-medium text-gray-900 text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="article in articles" 
                    :key="article.id"
                    class="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                    <td class="py-4 px-4 text-gray-700 font-medium">{{ article.title }}</td>
                    <td class="py-4 px-4 text-gray-500 truncate max-w-xs">{{ article.description }}</td>
                    <td class="py-4 px-4 text-gray-700">{{ formatDate(article.createdAt) }}</td>
                    <td class="py-4 px-4">
                        <div class="flex items-center justify-center gap-3">
                             <button 
                                @click="handleEdit(article.id)"
                                class="p-1.5 rounded-md text-[#4FD1C5] border border-[#4FD1C5] hover:bg-[#4FD1C5]/10 transition-colors"
                            >
                                <Pencil class="w-4 h-4" />
                            </button>
                            <button 
                                @click="handleDelete(article.id)"
                                class="p-1.5 rounded-md text-red-500 border border-red-500 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <Toast 
        :show="showToast"
        :message="toastMessage"
        :type="toastType"
        @close="showToast = false"
    />
  </div>
</template>
