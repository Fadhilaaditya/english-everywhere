<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'

const router = useRouter()

const articles = ref([
    {
        id: 1,
        title: "Kapan Menggunakan 'A' dan 'An'",
        description: 'Mencari cara agar anak-anak tetap se...',
        timeAdded: '18/06/2025',
        views: '2.000'
    },
    {
        id: 2,
        title: 'Pentingnya Dongeng dalam Meningkatkan Kosak...',
        description: 'Bingung mengajarkan penggunaan ar...',
        timeAdded: '01/06/2025',
        views: '1.500'
    },
    {
        id: 3,
        title: 'Cerita Sukses: Cara Bima Menaklukan Speaking',
        description: 'Ikuti kisah inspiratif salah satu murid k...',
        timeAdded: '20/05/2025',
        views: '1.000'
    },
    {
        id: 4,
        title: 'Panduan Memilih Buku Bacaan Bahasa Inggris',
        description: 'Kesulitan mencari buku yang pas? Ka...',
        timeAdded: '15/05/2025',
        views: '500'
    },
    {
        id: 5,
        title: '3 Permainan Sederhana untuk Latihan Pronun...',
        description: 'Kesulitan mencari buku yang pas? Ka...',
        timeAdded: '10/05/2025',
        views: '1.500'
    },
])

const handleCreate = () => {
    router.push('/admin/english-corner/create')
}

const handleEdit = (id: number) => {
    router.push(`/admin/english-corner/edit/${id}`)
}
</script>

<template>
  <div class="bg-white rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-bold text-gray-900">List Article's</h2>
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
                    <th class="py-4 px-4 font-medium text-gray-900 w-1/3">Decription</th>
                    <th class="py-4 px-4 font-medium text-gray-900">Time Added</th>
                    <th class="py-4 px-4 font-medium text-gray-900">Views</th>
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
                    <td class="py-4 px-4 text-gray-700">{{ article.timeAdded }}</td>
                    <td class="py-4 px-4 text-gray-700">{{ article.views }}</td>
                    <td class="py-4 px-4">
                        <div class="flex items-center justify-center gap-3">
                             <button 
                                @click="handleEdit(article.id)"
                                class="p-1.5 rounded-md text-[#4FD1C5] border border-[#4FD1C5] hover:bg-[#4FD1C5]/10 transition-colors"
                            >
                                <Pencil class="w-4 h-4" />
                            </button>
                            <button 
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
  </div>
</template>
