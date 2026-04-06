<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import EventSummary from './_components/EventSummary.vue'
import EventTable from './_components/EventTable.vue'

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
        <h1 class="text-2xl font-bold text-gray-900 mb-8">Events</h1>

        <!-- Summary -->
        <EventSummary class="mb-6 md:mb-8" />

        <!-- Table -->
        <EventTable />
      </main>
    </div>
  </div>
</template>
