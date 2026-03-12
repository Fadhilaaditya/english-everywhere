<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import DashboardSummary from './_components/DashboardSummary.vue'
import DashboardAppointment from './_components/DashboardAppointment.vue'
import LastTransaction from './_components/LastTransaction.vue'
import RecentEvents from './_components/RecentEvents.vue'

const isSidebarOpen = ref(false)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const dashboardData = ref({
    stats: {
        totalAccounts: 0,
        totalTransactions: 0,
        overduePayments: 0,
        pendingPayments: 0,
        pendingAppointments: 0
    },
    appointments: [],
    transactions: [],
    events: []
})

const isLoading = ref(true)

const fetchDashboardData = async () => {
    try {
        const response = await fetch(`${API_URL}/dashboard`)
        if (!response.ok) throw new Error('Failed to fetch dashboard data')
        dashboardData.value = await response.json()
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchDashboardData()
})
</script>

<template>
  <div class="min-h-screen bg-white font-poppins">
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Main Content -->
    <div class="transition-all duration-300 lg:pl-64">
      <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      
      <main class="p-4 lg:p-8 max-w-7xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div v-if="isLoading" class="flex items-center justify-center py-20">
            <div class="w-10 h-10 border-4 border-[#4FD1C5] border-t-transparent rounded-full animate-spin"></div>
        </div>

        <template v-else>
            <!-- Summary Cards -->
            <div class="mb-8">
                <DashboardSummary :stats="dashboardData.stats" />
            </div>

            <!-- Middle Row: Appointment & Transaction -->
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                <div class="lg:col-span-3">
                    <DashboardAppointment :appointments="dashboardData.appointments" />
                </div>
                <div class="lg:col-span-2">
                    <LastTransaction :transactions="dashboardData.transactions" />
                </div>
            </div>

            <!-- Bottom Row: Recent Events -->
            <div>
                <RecentEvents :events="dashboardData.events" />
            </div>
        </template>
      </main>
    </div>
  </div>
</template>
