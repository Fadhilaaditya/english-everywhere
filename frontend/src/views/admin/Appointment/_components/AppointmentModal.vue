<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { X, Calendar, Clock } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  programName?: string
  appointment?: any
}>()

const emit = defineEmits(['close', 'approve', 'update', 'delete', 'reject'])

const formData = ref({
    fullName: '',
    gender: 'Male',
    address: '',
    phone: '',
    email: '',
    birthDate: '',
    level: '', 
    course: '',
    date: '',
    startTime: '',
    endTime: '',
    fatherName: '',
    motherName: '',
    birthPlace: ''
})

watch(() => props.appointment, (newVal) => {
    if (newVal) {
        formData.value.course = props.programName || '' 
        formData.value.date = formatDate(newVal.date)
        formData.value.startTime = newVal.time
        formData.value.endTime = calculateEndTime(newVal.time)

        if (newVal.status === 'available') {
            // Edit Mode keys
            formData.value.fullName = ''
            formData.value.gender = 'Male'
            formData.value.address = ''
            formData.value.phone = ''
            formData.value.email = ''
            formData.value.birthDate = ''
            formData.value.level = props.programName || ''
        } else {
            // Waiting or Taken - fill real data
            formData.value.fullName = newVal.applicantName || newVal.name || ''
            formData.value.gender = newVal.applicantGender || 'Male'
            formData.value.address = newVal.applicantAddress || ''
            formData.value.phone = newVal.applicantPhone || ''
            formData.value.email = newVal.applicantEmail || ''
            formData.value.birthDate = newVal.applicantBirthDate || ''
            formData.value.level = props.programName || ''
            formData.value.fatherName = newVal.applicantFather || ''
            formData.value.motherName = newVal.applicantMother || ''
            formData.value.birthPlace = newVal.applicantBirthPlace || ''
        }
    }
}, { immediate: true })

const isTaken = computed(() => props.appointment?.status === 'taken' || props.appointment?.status === 'booked')
const isAvailable = computed(() => props.appointment?.status === 'available')

const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB') 
}
// We need raw date for input
const rawDate = computed(() => props.appointment?.date || '')

const calculateEndTime = (startTime: string) => {
    if (!startTime) return ''
    const parts = startTime.split(':').map(Number)
    if (parts.length < 2) return startTime
    const [hours, minutes] = parts
    
    if (hours === undefined) return startTime
    
    const endHour = hours + 2 
    const minStr = typeof minutes !== 'undefined' ? minutes.toString().padStart(2, '0') : '00'
    return `${endHour.toString().padStart(2, '0')}:${minStr}`
}

const handleApprove = () => {
    emit('approve', formData.value)
}

const handleReject = () => {
    emit('reject', props.appointment.id)
}

const handleUpdate = () => {
    emit('update', { 
        id: props.appointment.id,
        date: rawDate.value, 
        time: formData.value.startTime
    })
}

const handleDelete = () => {
    emit('delete', props.appointment.id)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl p-8">
        <!-- Close Button -->
        <button 
            @click="$emit('close')"
            class="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
            <X class="w-6 h-6" />
        </button>

        <!-- Edit/Delete Mode for Available Slots -->
        <div v-if="isAvailable" class="space-y-6 mt-2">
             <h2 class="text-2xl font-bold text-gray-900 mb-6">Manage Schedule</h2>
             
             <!-- Course -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Course</label>
                <div class="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 text-gray-700">
                    {{ formData.course }}
                </div>
            </div>

             <!-- Time Editing -->
             <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Time</label>
                 <div class="relative">
                     <input 
                        v-model="formData.startTime"
                        type="time"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-4 pt-4">
                 <button 
                    @click="handleDelete"
                    class="flex-1 py-3 rounded-lg text-white font-medium transition-colors bg-red-500 hover:bg-red-600"
                >
                    Delete
                </button>
                 <button 
                    @click="handleUpdate"
                    class="flex-1 py-3 rounded-lg text-white font-medium transition-colors bg-[#4FD1C5] hover:bg-[#3dbdb0]"
                >
                    Save Changes
                </button>
            </div>
        </div>

        <!-- Default Applicant View (Existing) -->
        <div v-else class="space-y-6 mt-2">
            <!-- Course (Read Only) -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Course</label>
                <div class="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 text-gray-700">
                    {{ formData.course }}
                </div>
            </div>

            <!-- Date & Time (Read Only) -->
            <div class="grid grid-cols-3 gap-4">
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Tanggal Test</label>
                    <div class="relative">
                        <div class="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 text-gray-700">
                            {{ formData.date }}
                        </div>
                        <Calendar class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Jam Mulai</label>
                    <div class="relative">
                        <div class="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 text-gray-700">
                            {{ formData.startTime }}
                        </div>
                         <Clock class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Jam Selesai</label>
                    <div class="relative">
                         <div class="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 text-gray-700">
                            {{ formData.endTime }}
                        </div>
                        <Clock class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Full Name -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                        v-model="formData.fullName"
                        type="text" 
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>

                <!-- Gender -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Gender</label>
                    <select 
                        v-model="formData.gender"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 bg-white"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <!-- Address (Full width) -->
                <div class="md:col-span-2 space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Address</label>
                    <textarea 
                        v-model="formData.address"
                        rows="2"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 resize-none"
                    ></textarea>
                </div>

                <!-- Parents -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Nama Ayah</label>
                    <input v-model="formData.fatherName" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50" />
                </div>
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Nama Ibu</label>
                    <input v-model="formData.motherName" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50" />
                </div>

                <!-- Birth Place -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Tempat Lahir</label>
                    <input v-model="formData.birthPlace" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50" />
                </div>

                <!-- Phone -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">No Telp</label>
                    <input 
                        v-model="formData.phone"
                        type="text" 
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>

                <!-- Email -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                        v-model="formData.email"
                        type="email" 
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>

                <!-- Birth Date -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                    <div class="relative">
                        <input 
                            v-model="formData.birthDate"
                            type="date"
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                        />
                    </div>
                </div>

                 <!-- Level -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Level</label>
                    <div class="relative">
                        <select 
                            v-model="formData.level"
                             class="w-full px-4 py-2.5 rounded-lg bg-gray-200 border border-gray-300 focus:outline-none text-gray-700 appearance-none"
                             disabled
                        >
                            <option :value="formData.level">{{ formData.level }}</option>
                        </select>
                        <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-4 pt-4 mt-8">
                <button 
                    v-if="!isTaken"
                    @click="handleReject"
                    class="flex-1 py-4 rounded-lg text-white text-xl font-medium transition-colors bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30"
                >
                    Reject
                </button>
                <button 
                    @click="handleApprove"
                    :disabled="isTaken"
                    class="flex-1 py-4 rounded-lg text-white text-xl font-medium transition-colors shadow-lg shadow-[#4FD1C5]/30 flex items-center justify-center gap-2"
                     :class="isTaken ? 'w-full bg-gray-400 cursor-not-allowed shadow-none' : 'bg-[#4FD1C5] hover:bg-[#3dbdb0]'"
                >
                    {{ isTaken ? 'Approved' : 'Approve' }}
                </button>
            </div>
        </div>
    </div>
  </div>
</template>
