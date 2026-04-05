<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import ArticleSummary from './_components/ArticleSummary.vue'
import ArticleTable from './_components/ArticleTable.vue'

const isSidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-white font-poppins">
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Main Content -->
    <div class="transition-all duration-300 lg:pl-64">
      <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      
      <main class="p-4 lg:p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">English Corner</h1>

        <!-- Summary -->
        <ArticleSummary class="mb-6 md:mb-8" />

        <!-- Table -->
        <ArticleTable />
      </main>
    </div>
  </div>
</template>
