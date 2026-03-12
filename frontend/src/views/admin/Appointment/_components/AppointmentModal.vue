<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import api from '@/api'
import { X, Calendar, Clock } from 'lucide-vue-next'
import CustomDropdown from '@/components/CustomDropdown.vue'

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

const bookings = ref<any[]>([])
const selectedBookingIndex = ref(0)
const isLoading = ref(false)

const genderOptions = ['Male', 'Female']

const selectedBooking = computed(() => {
    if (bookings.value.length === 0) return null
    return bookings.value[selectedBookingIndex.value] || bookings.value[0]
})

watch(() => props.isOpen, async (newVal) => {
    if (newVal && props.appointment) {
        isLoading.value = true
        try {
            const response = await api.get(`/programs/schedules/${props.appointment.id}/bookings`)
            bookings.value = response.data
            selectedBookingIndex.value = 0
        } catch (e) {
            console.error('Failed to fetch bookings', e)
        } finally {
            isLoading.value = false
        }
    }
})

watch([() => props.appointment, selectedBookingIndex, bookings], () => {
    const newVal = props.appointment
    const booking = bookings.value[selectedBookingIndex.value]
    
    if (newVal) {
        formData.value.course = props.programName || newVal.program?.title || 'No Program'
        formData.value.date = formatDate(newVal.date)
        formData.value.startTime = newVal.time
        formData.value.endTime = calculateEndTime(newVal.time)

        if (booking) {
            formData.value.fullName = booking.applicantName || ''
            formData.value.gender = booking.applicantGender || 'Male'
            formData.value.address = booking.applicantAddress || ''
            formData.value.phone = booking.applicantPhone || ''
            formData.value.email = booking.applicantEmail || ''
            formData.value.birthDate = booking.applicantBirthDate || ''
            formData.value.fatherName = booking.applicantFather || ''
            formData.value.motherName = booking.applicantMother || ''
            formData.value.birthPlace = booking.applicantBirthPlace || ''
        } else {
             formData.value.fullName = ''
             formData.value.gender = 'Male'
             formData.value.address = ''
             formData.value.phone = ''
             formData.value.email = ''
             formData.value.birthDate = ''
             formData.value.fatherName = ''
             formData.value.motherName = ''
             formData.value.birthPlace = ''
        }
    }
}, { immediate: true })

const isPending = computed(() => {
    const booking = bookings.value[selectedBookingIndex.value]
    return booking?.status === 'PENDING'
})
const isBooked = computed(() => {
    const booking = bookings.value[selectedBookingIndex.value]
    return booking?.status === 'BOOKED'
})
const isAccepted = computed(() => {
    const booking = bookings.value[selectedBookingIndex.value]
    return booking?.status === 'ACCEPTED'
})
const isSuccess = computed(() => {
    const booking = bookings.value[selectedBookingIndex.value]
    return booking?.status === 'SUCCESS'
})
const isRejected = computed(() => {
    const booking = bookings.value[selectedBookingIndex.value]
    return booking?.status === 'REJECTED'
})
const isAvailable = computed(() => bookings.value.length === 0)

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
    if (selectedBooking.value) {
        emit('approve', { id: selectedBooking.value.id, ...formData.value })
    }
}

const handlePassTest = async () => {
    if (!selectedBooking.value) return
    isLoading.value = true
    try {
        await api.put(`/programs/bookings/${selectedBooking.value.id}/accept`)
        emit('close')
    } catch (e) {
        console.error('Failed to pass test', e)
    } finally {
        isLoading.value = false
    }
}

const handleReject = () => {
    if (selectedBooking.value) {
        emit('reject', selectedBooking.value.id)
    }
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
    <div class="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        <!-- Sticky Header -->
        <div class="sticky top-0 bg-white z-20 px-4 md:px-8 py-4 md:py-6 pb-2 flex justify-between items-center rounded-t-2xl border-b border-gray-100/50">
            <h2 class="text-2xl font-bold text-gray-900">
                {{ isAvailable ? 'Manage Schedule' : 'Appointment Form' }}
            </h2>
            <button 
                @click="$emit('close')"
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X class="w-6 h-6" />
            </button>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto p-4 md:p-8 pt-4">

        <!-- Manage Schedule (Time & Slots) -->
        <div class="space-y-6">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Course -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Course</label>
                    <div class="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-700">
                        {{ formData.course }}
                    </div>
                </div>

                <!-- Slots -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Quota Slots</label>
                    <div class="flex gap-2">
                        <input 
                            v-model="props.appointment.maxSlots"
                            type="number"
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                        />
                    </div>
                </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Date -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Date</label>
                    <div class="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-700">
                        {{ formData.date }}
                    </div>
                </div>

                <!-- Time Booking -->
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
             </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4 border-b border-gray-100 pb-6">
                 <button 
                    @click="handleDelete"
                    class="flex-1 py-3 rounded-lg text-white font-medium transition-colors bg-red-500 hover:bg-red-600"
                >
                    Delete Schedule
                </button>
                 <button 
                    @click="handleUpdate"
                    class="flex-1 py-3 rounded-lg text-white font-medium transition-colors bg-[#4FD1C5] hover:bg-[#3dbdb0]"
                >
                    Update Schedule
                </button>
            </div>
        </div>

        <!-- Bookings List -->
        <div v-if="bookings.length > 0" class="mt-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Applicants ({{ bookings.length }}/{{ props.appointment?.maxSlots }})</h3>
            <div class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                <button 
                    v-for="(booking, index) in bookings" 
                    :key="booking.id"
                    @click="selectedBookingIndex = index"
                    class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border flex items-center gap-2"
                    :class="[
                        selectedBookingIndex === index 
                            ? 'shadow-md scale-105' 
                            : 'opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0',
                        booking.status === 'ACCEPTED' 
                            ? (selectedBookingIndex === index ? 'bg-green-500 text-white border-green-500' : 'bg-green-50 text-green-600 border-green-200')
                            : booking.status === 'REJECTED'
                            ? (selectedBookingIndex === index ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 text-red-600 border-red-200')
                            : (selectedBookingIndex === index ? 'bg-[#4FD1C5] text-white border-[#4FD1C5]' : 'bg-teal-50 text-teal-600 border-teal-200')
                    ]"
                >
                    <span class="w-2 h-2 rounded-full bg-current"></span>
                    {{ booking.applicantName }} ({{ booking.status }})
                </button>
            </div>
        </div>

        <!-- Applicant View -->
        <div v-if="bookings.length > 0" class="space-y-6 pt-4">
            <!-- Course (Read Only) -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Course</label>
                <div class="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 text-gray-700">
                    {{ formData.course }}
                </div>
            </div>

            <!-- Date & Time (Read Only) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                    <CustomDropdown 
                        v-model="formData.gender"
                        :options="genderOptions"
                        placeholder="Select Gender"
                    />
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
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4 mt-8">
                <template v-if="!isSuccess">
                    <button 
                        v-if="!isRejected"
                        @click="handleReject"
                        class="flex-1 py-4 rounded-lg text-white text-xl font-medium transition-colors bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30"
                    >
                        Reject
                    </button>
                    
                    <!-- PENDING -> BOOKED -->
                    <button 
                        v-if="isPending"
                        @click="handleApprove"
                        class="flex-1 py-4 rounded-lg text-white text-xl font-medium transition-colors shadow-lg shadow-[#4FD1C5]/30 bg-[#4FD1C5] hover:bg-[#3dbdb0]"
                    >
                        Approve Booking
                    </button>

                    <!-- BOOKED -> ACCEPTED -->
                    <button 
                        v-if="isBooked"
                        @click="handlePassTest"
                        class="flex-1 py-4 rounded-lg text-white text-xl font-medium transition-colors shadow-lg shadow-[#4FD1C5]/30 bg-[#4FD1C5] hover:bg-[#3dbdb0]"
                    >
                        Accept
                    </button>

                    <!-- REJECTED -> BOOKED (Restore) -->
                    <button 
                        v-if="isRejected"
                        @click="handleApprove"
                        class="flex-1 py-4 rounded-lg text-white text-xl font-medium transition-colors shadow-lg shadow-[#4FD1C5]/30 bg-[#4FD1C5] hover:bg-[#3dbdb0]"
                    >
                        Restore & Approve
                    </button>
                </template>
                <div v-else class="w-full py-4 bg-green-50 border border-green-200 rounded-lg text-center text-green-700 font-bold text-xl shadow-sm">
                    Student account created successfully!
                </div>
            </div>
破        </div>
        
        <div v-else class="py-12 text-center text-gray-500">
            No applicants yet for this time slot.
        </div>
        </div>
    </div>
  </div>
</template>
