<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Calendar, MapPin, Tag } from 'lucide-vue-next'

const props = defineProps<{
    events: any[]
}>()

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-12">
    <h3 class="text-lg font-bold text-gray-900 mb-6 font-poppins">Recent Events</h3>
    
    <div class="w-full overflow-x-auto">
        <table class="w-full min-w-[600px]">
            <thead>
                <tr class="text-left border-b border-gray-50">
                    <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Event Title</th>
                    <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                    <th class="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pr-4">Price</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                <tr v-for="event in events" :key="event.id" class="group hover:bg-gray-50/50 transition-colors">
                    <td class="py-5 pl-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-[#4FD1C5]/10 flex items-center justify-center text-[#4FD1C5]">
                                <Tag class="w-5 h-5" />
                            </div>
                            <span class="text-sm font-bold text-gray-900">{{ event.title }}</span>
                        </div>
                    </td>
                    <td class="py-5 text-sm text-gray-600 font-medium">
                        <div class="flex items-center gap-2">
                            <Calendar class="w-4 h-4 text-gray-400" />
                            {{ formatDate(event.date) }}
                        </div>
                    </td>
                    <td class="py-5 text-sm text-gray-600 font-medium">
                         <div class="flex items-center gap-2">
                            <MapPin class="w-4 h-4 text-gray-400" />
                            {{ event.location || 'Online' }}
                        </div>
                    </td>
                    <td class="py-5 pr-4">
                        <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-[#4FD1C5]/5 text-[#4FD1C5] border border-[#4FD1C5]/10">
                            {{ event.price }}
                        </span>
                    </td>
                </tr>

                <tr v-if="events.length === 0">
                    <td colspan="4" class="py-12 text-center text-sm text-gray-400 italic font-medium">
                        No recent events found
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>
