<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import PaymentSummary from './_components/PaymentSummary.vue'
import PaymentTable from './_components/PaymentTable.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
const stats = ref({
  totalTransactions: 0,
  transactionsToday: 0,
  jatuhTempoCount: 0,
  tertundaCount: 0
})

const handleUpdateStats = (newStats: any) => {
  stats.value = newStats
}
</script>

<template>
  <div class="min-h-screen bg-white font-poppins lg:flex">
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Main Content -->
    <div class="flex-1 transition-all duration-300" :class="isSidebarOpen ? 'lg:pl-64' : 'lg:pl-64'">
      <Header @toggle-sidebar="toggleSidebar" />
      
      <main class="p-4 md:p-8">
        <div class="flex justify-between items-center mb-6 md:mb-8">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Payments</h1>
        </div>

        <!-- Summary -->
        <PaymentSummary 
          :total-transactions="stats.totalTransactions"
          :transactions-today="stats.transactionsToday"
          :jatuh-tempo-count="stats.jatuhTempoCount"
          :tertunda-count="stats.tertundaCount"
        />

        <!-- Table -->
        <PaymentTable @update-stats="handleUpdateStats" />
      </main>
    </div>
  </div>
</template>