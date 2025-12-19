<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import ApplicantSummary from './_components/ApplicantSummary.vue'
import ApplicantTable from './_components/ApplicantTable.vue'
</script>

<template>
  <div class="min-h-screen bg-white font-poppins">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="pl-64">
      <Header />
      
      <main class="p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">Applicant Data</h1>

        <!-- Summary -->
        <ApplicantSummary />

        <!-- Table -->
        <ApplicantTable />
      </main>
    </div>
  </div>
</template>
