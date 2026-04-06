<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: any
  options: any[]
  placeholder?: string
  labelKey?: string
  valueKey?: string
  class?: string
  disabled?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const labelKey = computed(() => props.labelKey || 'label')

const getValue = (option: any) => {
  if (typeof option !== 'object' || option === null) return option
  return props.valueKey ? option[props.valueKey] : option
}

const getLabel = (option: any) => {
  if (typeof option !== 'object' || option === null) return option
  return option[labelKey.value]
}

const selectedOption = computed(() => {
  return props.options.find(opt => {
    const val = getValue(opt)
    // Deep equality check for objects if valueKey is not provided
    if (typeof val === 'object' && val !== null && typeof props.modelValue === 'object' && props.modelValue !== null) {
        return JSON.stringify(val) === JSON.stringify(props.modelValue)
    }
    return val == props.modelValue
  })
})

const displayLabel = computed(() => {
  if (selectedOption.value === undefined || selectedOption.value === null) return props.placeholder || 'Select option...'
  return getLabel(selectedOption.value)
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const selectOption = (option: any) => {
  const value = getValue(option)
  emit('update:modelValue', value)
  emit('change', value)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div class="relative inline-block w-full" ref="dropdownRef">
    <!-- Trigger -->
    <button
      type="button"
      @click="toggleDropdown"
      class="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-[#4FD1C5] focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/20 transition-all text-left"
      :class="[
        props.class, 
        { 'border-[#4FD1C5] ring-2 ring-[#4FD1C5]/10': isOpen },
        { 'bg-gray-50 cursor-not-allowed opacity-70': disabled }
      ]"
      :disabled="disabled"
    >
      <span class="truncate" :class="{ 'text-gray-400': selectedOption === undefined || selectedOption === null }">
        {{ displayLabel }}
      </span>
      <ChevronDown 
        class="w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180 text-[#4FD1C5]': isOpen }"
      />
    </button>

    <!-- Menu -->
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-[110] mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in slide-in-from-top-2 duration-200"
      >
        <div class="py-1">
          <button
            v-for="(option, index) in props.options"
            :key="index"
            type="button"
            @click="selectOption(option)"
            class="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-[#F0FFF4] hover:text-[#4FD1C5]"
            :class="[
              getValue(option) == props.modelValue || 
              (typeof getValue(option) === 'object' && JSON.stringify(getValue(option)) === JSON.stringify(props.modelValue))
                ? 'bg-[#F0FFF4] text-[#4FD1C5] font-semibold'
                : 'text-gray-700'
            ]"
          >
            <span class="truncate">
              {{ getLabel(option) }}
            </span>
            <Check 
              v-if="getValue(option) == props.modelValue || 
              (typeof getValue(option) === 'object' && JSON.stringify(getValue(option)) === JSON.stringify(props.modelValue))"
              class="w-4 h-4"
            />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Optional: Custom scrollbar for the menu */
.max-h-60::-webkit-scrollbar {
  width: 6px;
}
.max-h-60::-webkit-scrollbar-track {
  background: transparent;
}
.max-h-60::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.max-h-60::-webkit-scrollbar-thumb:hover {
  background: #CBD5E0;
}
</style>
