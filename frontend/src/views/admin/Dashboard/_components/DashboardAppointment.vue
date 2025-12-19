<script setup lang="ts">
const appointments = [
  { name: 'Yoga', date: '18/09/2025', time: '13:00 WIB', test: 'Hi Kids!' },
  { name: 'Budi', date: '18/09/2025', time: '15:00 WIB', test: 'Get Smart' },
]
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 h-full shadow-sm">
    <div class="flex items-center gap-2 mb-6">
        <h3 class="text-lg font-bold text-gray-900">Appointment</h3>
        <div class="w-2 h-2 bg-red-500 rounded-full"></div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="text-left border-b border-gray-100">
            <th class="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider pl-4">Name</th>
            <th class="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th class="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
            <th class="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider pr-4">Test</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="(apt, index) in appointments" :key="index" class="hover:bg-gray-50">
            <td class="py-4 pl-4 text-sm font-medium text-gray-900">{{ apt.name }}</td>
            <td class="py-4 text-sm text-gray-600">{{ apt.date }}</td>
             <td class="py-4 text-sm text-gray-600">{{ apt.time }}</td>
             <td class="py-4 pr-4">
                 <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                     {{ apt.test }}
                 </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
