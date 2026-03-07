<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Toast from '../../../../components/Toast.vue'

const router = useRouter()
const articles = ref<any[]>([])

// Search and Pagination State
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredArticles = computed(() => {
    if (!searchQuery.value) return articles.value
    const query = searchQuery.value.toLowerCase()
    return articles.value.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.description.toLowerCase().includes(query)
    )
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / itemsPerPage))

const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredArticles.value.slice(start, end)
})

// Reset to first page when searching
watch(searchQuery, () => {
    currentPage.value = 1
})

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
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 class="text-lg font-bold text-gray-900">List Articles</h2>
        
        <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div class="relative w-full sm:w-80">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search title or description..."
                    class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all text-sm"
                />
            </div>
            
            <button 
                @click="handleCreate"
                class="bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
            >
                Create Article
                <Plus class="w-4 h-4" />
            </button>
        </div>
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
                    v-for="article in paginatedArticles" 
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

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50 pt-6">
        <p class="text-sm text-gray-500">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredArticles.length) }} of {{ filteredArticles.length }} articles
        </p>
        <div class="flex items-center gap-2">
            <button 
                @click="currentPage > 1 && currentPage--"
                :disabled="currentPage === 1"
                class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft class="w-4 h-4" />
            </button>
            <div class="flex items-center gap-1">
                <button 
                    v-for="page in totalPages" 
                    :key="page"
                    @click="currentPage = page"
                    class="px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all"
                    :class="currentPage === page ? 'bg-[#4FD1C5] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
                >
                    {{ page }}
                </button>
            </div>
            <button 
                @click="currentPage < totalPages && currentPage++"
                :disabled="currentPage === totalPages"
                class="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight class="w-4 h-4" />
            </button>
        </div>
    </div>

    <!-- No Results -->
    <div v-if="filteredArticles.length === 0" class="py-12 text-center text-gray-500 italic">
        No articles found matching "{{ searchQuery }}"
    </div>
    <Toast 
        :show="showToast"
        :message="toastMessage"
        :type="toastType"
        @close="showToast = false"
    />
  </div>
</template>
