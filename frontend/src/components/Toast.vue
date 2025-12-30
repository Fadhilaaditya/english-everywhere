<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import { CheckCircle, XCircle, X } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
  message: string
  type?: 'success' | 'error'
  duration?: number
}>()

const emit = defineEmits(['close'])

const isSuccess = computed(() => props.type !== 'error')

let timer: any

const startTimer = () => {
    clearTimeout(timer)
    if (props.show) {
        timer = setTimeout(() => {
            emit('close')
        }, props.duration || 3000)
    }
}

watch(() => props.show, (newVal) => {
    if (newVal) startTimer()
})

onUnmounted(() => {
    clearTimeout(timer)
})
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
        v-if="show"
        class="fixed bottom-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg shadow-lg min-w-[300px] border-l-4 bg-white"
        :class="isSuccess ? 'border-[#4FD1C5]' : 'border-red-500'"
    >
        <div :class="isSuccess ? 'text-[#4FD1C5]' : 'text-red-500'">
            <CheckCircle v-if="isSuccess" class="w-6 h-6" />
            <XCircle v-else class="w-6 h-6" />
        </div>
        
        <div class="flex-1">
            <h4 class="font-medium text-gray-900" :class="isSuccess ? 'text-[#4FD1C5]' : 'text-red-600'">
                {{ isSuccess ? 'Success' : 'Error' }}
            </h4>
            <p class="text-sm text-gray-600">{{ message }}</p>
        </div>

        <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500 p-1"
        >
            <X class="w-4 h-4" />
        </button>
    </div>
  </Transition>
</template>
