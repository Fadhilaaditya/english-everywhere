<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import DashboardSummary from './_components/DashboardSummary.vue'
import DashboardAppointment from './_components/DashboardAppointment.vue'
import LastTransaction from './_components/LastTransaction.vue'
import RecentMaterials from './_components/RecentMaterials.vue'

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
        <h1 class="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <!-- Summary Cards -->
        <div class="mb-8">
            <DashboardSummary />
        </div>

        <!-- Middle Row: Appointment & Transaction -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
            <div class="lg:col-span-3">
                <DashboardAppointment />
            </div>
            <div class="lg:col-span-2">
                <LastTransaction />
            </div>
        </div>

        <!-- Bottom Row: Learning Materials -->
        <div>
            <RecentMaterials />
        </div>
      </main>
    </div>
  </div>
</template>
