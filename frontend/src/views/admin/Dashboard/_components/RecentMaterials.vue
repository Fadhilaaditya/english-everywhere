<script setup lang="ts">
const materials = [] // Empty for now as per design mockup showing mostly empty space or generic structure
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
    <h3 class="text-lg font-bold text-gray-900 mb-6">Recent Learning Materials Added</h3>
    
    <div class="bg-gray-50 rounded-xl p-8 min-h-[100px] flex items-center justify-center text-gray-400">
        <div class="w-full overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="text-left">
                        <th class="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider pl-4">Learning Materials</th>
                         <th class="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                          <th class="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                           <th class="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Skills</th>
                            <th class="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider pr-4">Topic</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Empty State / Placeholder -->
                     <tr>
                         <td colspan="5" class="py-8 text-center text-sm text-gray-400">No recent materials</td>
                     </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
</template>
