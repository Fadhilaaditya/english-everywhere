<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import { CheckCircle, XCircle, X } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
  message: string
  title?: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}>()

const emit = defineEmits(['close'])

const toastType = computed(() => props.type || 'success')
const isError = computed(() => toastType.value === 'error')
const isInfo = computed(() => toastType.value === 'info')
const isSuccess = computed(() => toastType.value === 'success')

const displayTitle = computed(() => {
    if (props.title) return props.title
    if (isError.value) return 'Error'
    if (isInfo.value) return 'Information'
    return 'Success'
})

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
        :class="[
            isError ? 'border-red-500' : 
            isInfo ? 'border-blue-500' : 'border-[#4FD1C5]'
        ]"
    >
        <div :class="[
            isError ? 'text-red-500' : 
            isInfo ? 'text-blue-500' : 'text-[#4FD1C5]'
        ]">
            <CheckCircle v-if="isSuccess" class="w-6 h-6" />
            <XCircle v-else-if="isError" class="w-6 h-6" />
            <CheckCircle v-else class="w-6 h-6" /> <!-- Fallback icon for info -->
        </div>
        
        <div class="flex-1">
            <h4 class="font-bold text-gray-900" :class="[
                isError ? 'text-red-600' : 
                isInfo ? 'text-blue-600' : 'text-[#4FD1C5]'
            ]">
                {{ displayTitle }}
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
