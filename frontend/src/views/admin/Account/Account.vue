<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import AccountSummary from './_components/AccountSummary.vue'
import AccountTable from './_components/AccountTable.vue'
</script>

<template>
  <div class="min-h-screen bg-white font-poppins">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="pl-64">
      <Header />
      
      <main class="p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">Account</h1>

        <!-- Summary -->
        <AccountSummary />

        <!-- Table -->
        <AccountTable />
      </main>
    </div>
  </div>
</template>
