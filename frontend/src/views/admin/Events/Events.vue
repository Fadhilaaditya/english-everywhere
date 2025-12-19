<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import EventSummary from './_components/EventSummary.vue'
import EventTable from './_components/EventTable.vue'
</script>

<template>
  <div class="min-h-screen bg-white font-poppins">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="pl-64">
      <Header />
      
      <main class="p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">Events</h1>

        <!-- Summary -->
        <EventSummary />

        <!-- Table -->
        <EventTable />
      </main>
    </div>
  </div>
</template>
