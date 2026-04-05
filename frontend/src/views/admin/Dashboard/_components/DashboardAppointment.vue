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
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
            <h3 class="text-lg font-bold text-gray-900 font-poppins">Appointment</h3>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-full">This Month</span>
        </div>
    </div>
    
    <div class="overflow-y-auto pr-2 custom-scrollbar" style="max-height: 400px;">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left border-b border-gray-100">
              <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Name</th>
              <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</th>
              <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Test</th>
              <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pr-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="(apt, index) in appointments" :key="index" class="hover:bg-gray-50/50 transition-colors">
              <td class="py-4 pl-4 text-sm font-bold text-gray-900">{{ apt.name }}</td>
              <td class="py-4 text-sm text-gray-600 font-medium">{{ formatDate(apt.date) }}</td>
               <td class="py-4 text-sm text-gray-600 font-medium">{{ apt.time }}</td>
               <td class="py-4">
                   <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#4FD1C5]/5 text-[#4FD1C5] border border-[#4FD1C5]/10 uppercase tracking-wider">
                       {{ apt.test }}
                   </span>
              </td>
              <td class="py-4 pr-4">
                  <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                      :class="[
                          apt.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                          apt.status === 'ACCEPTED' ? 'bg-green-100 text-green-700 border border-green-200' :
                          apt.status === 'BOOKED' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          apt.status === 'REJECTED' ? 'bg-red-100 text-red-700 border border-red-200' :
                          'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      ]"
                  >
                      {{ apt.status?.toLowerCase() }}
                  </span>
              </td>
            </tr>
            <tr v-if="appointments.length === 0">
                <td colspan="5" class="py-12 text-center text-sm text-gray-400 italic font-medium">No upcoming appointments</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #CBD5E0;
}
</style>
