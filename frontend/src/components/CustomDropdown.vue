<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { ChevronDown, Check, Search } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: any
  options: any[]
  placeholder?: string
  labelKey?: string
  valueKey?: string
  class?: string
  disabled?: boolean
  searchable?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

const labelKey = computed(() => props.labelKey || 'label')

const getValue = (option: any) => {
  if (typeof option !== 'object' || option === null) return option
  return props.valueKey ? option[props.valueKey] : option
}

const getLabel = (option: any) => {
  if (typeof option !== 'object' || option === null) return option
  return option[labelKey.value]
}

const filteredOptions = computed(() => {
    if (!props.searchable || !searchQuery.value) return props.options
    const query = searchQuery.value.toLowerCase()
    return props.options.filter(opt => {
        const label = getLabel(opt)?.toString().toLowerCase() || ''
        return label.includes(query)
    })
})

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
  searchQuery.value = ''
}

watch(isOpen, async (val) => {
    if (val && props.searchable) {
        await nextTick()
        searchInputRef.value?.focus()
    } else if (!val) {
        searchQuery.value = ''
    }
})

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
    <div
      class="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-[#4FD1C5] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#4FD1C5]/20 transition-all text-left relative cursor-pointer"
      :class="[
        props.class, 
        { 'border-[#4FD1C5] ring-2 ring-[#4FD1C5]/10': isOpen },
        { 'bg-gray-50 cursor-not-allowed opacity-70': disabled }
      ]"
      @click="toggleDropdown"
    >
      <div class="flex-1 min-w-0 pr-2 h-[38px] flex items-center px-4">
        <!-- Search Input -->
        <input
          v-if="searchable && isOpen"
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          :placeholder="placeholder || 'Search...'"
          class="w-full h-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-sm font-medium text-gray-900 placeholder:text-gray-300"
          @click.stop
        />
        <!-- Display Label -->
        <span 
          v-else
          class="truncate font-medium transition-opacity duration-200"
          :class="{ 
            'text-gray-400': !selectedOption,
            'opacity-0': searchable && isOpen 
          }"
        >
          {{ displayLabel }}
        </span>
      </div>
      
      <div class="pr-4 flex items-center">
        <ChevronDown 
          class="w-4 h-4 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180 text-[#4FD1C5]': isOpen }"
        />
      </div>
    </div>

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
            v-for="(option, index) in filteredOptions"
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
