<script setup lang="ts">
const props = defineProps<{
    appointments: any[]
}>()

const formatDate = (dateString: string) => {
    if (!dateString || dateString === '-') return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    })
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 h-full shadow-sm">
    <div class="flex items-center gap-2 mb-6">
        <h3 class="text-lg font-bold text-gray-900 font-poppins">Appointment</h3>
        <div class="w-2 h-2 bg-red-500 rounded-full"></div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="text-left border-b border-gray-100">
            <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Name</th>
            <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
            <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</th>
            <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pr-4">Test</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="(apt, index) in appointments" :key="index" class="hover:bg-gray-50/50 transition-colors">
            <td class="py-4 pl-4 text-sm font-bold text-gray-900">{{ apt.name }}</td>
            <td class="py-4 text-sm text-gray-600 font-medium">{{ formatDate(apt.date) }}</td>
             <td class="py-4 text-sm text-gray-600 font-medium">{{ apt.time }}</td>
             <td class="py-4 pr-4">
                 <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#4FD1C5]/5 text-[#4FD1C5] border border-[#4FD1C5]/10 uppercase tracking-wider">
                     {{ apt.test }}
                 </span>
            </td>
          </tr>
          <tr v-if="appointments.length === 0">
              <td colspan="4" class="py-12 text-center text-sm text-gray-400 italic font-medium">No upcoming appointments</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
