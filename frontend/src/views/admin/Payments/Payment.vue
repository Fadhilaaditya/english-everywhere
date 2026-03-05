<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import PaymentSummary from './_components/PaymentSummary.vue'
import PaymentTable from './_components/PaymentTable.vue'
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
            <h1 class="text-3xl font-bold text-gray-900">Payments</h1>
        </div>

        <!-- Summary -->
        <PaymentSummary />

        <!-- Table -->
        <PaymentTable />
      </main>
    </div>
  </div>
</template>