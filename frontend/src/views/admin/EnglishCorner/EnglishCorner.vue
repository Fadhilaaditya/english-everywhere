<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import ArticleSummary from './_components/ArticleSummary.vue'
import ArticleTable from './_components/ArticleTable.vue'
</script>

<template>
  <div class="min-h-screen bg-white font-poppins">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="pl-64">
      <Header />
      
      <main class="p-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900">English Corner</h1>
        </div>

        <!-- Summary -->
        <ArticleSummary />

        <!-- Table -->
        <ArticleTable />
      </main>
    </div>
  </div>
</template>
