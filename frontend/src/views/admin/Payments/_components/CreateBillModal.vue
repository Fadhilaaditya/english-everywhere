<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { X, Plus, Trash2, Loader2 } from 'lucide-vue-next'
import CustomDropdown from '@/components/Dropdown.vue'
import api from '@/api'

const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits(['close', 'submit'])

// Form Data
const formData = ref({
    billDate: new Date().toLocaleDateString('en-GB'),
    invoiceNo: `INV/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000)}`, 
    studentId: null as number | null,
    programId: null as number | null,
    publishDate: new Date().toISOString().slice(0, 10),
    courseFee: 0,
    paymentType: 'Lunas' as 'Lunas' | 'Cicilan',
    installments: [] as { dueDate: string, publishDate: string, amount: number }[]
})

const isSubmitting = ref(false)

// Real Data state
const students = ref<any[]>([])
const courses = ref<any[]>([])

const fetchInitialData = async () => {
  try {
    const [studentsRes, programsRes] = await Promise.all([
      api.get('/students'),
      api.get('/programs')
    ]);
    students.value = studentsRes.data || [];
    courses.value = programsRes.data || [];
  } catch(e) {
    console.error("Failed to load students/programs", e);
  }
}

onMounted(() => {
  fetchInitialData();
});

const studentOptions = computed(() => 
    students.value.map(s => ({ id: s.id, name: s.name, level: s.course, programId: s.programId }))
)

const courseOptions = computed(() => {
    // Collect all programs and their levels into a flat list for selection
    const allOptions: any[] = []
    courses.value.forEach(c => {
        if (c.levels && c.levels.length > 0) {
            c.levels.forEach((l: any) => {
                allOptions.push({ id: l.id, title: l.title })
            })
        } else {
            allOptions.push({ id: c.id, title: c.title })
        }
    })
    return allOptions
})

const handleStudentChange = (studentId: number) => {
    const student = students.value.find(s => s.id === studentId);
    if (student) {
        // Priority 1: Match by programId (Specific Level)
        if (student.programId) {
            const enrolledCourse = courseOptions.value.find(c => c.id === student.programId);
            if (enrolledCourse) {
                formData.value.programId = enrolledCourse.id;
                return;
            }
        }
        
        // Priority 2: Match by exact title string if programId doesn't exist or doesn't match
        if (student.course) {
            const enrolledCourse = courseOptions.value.find(c => c.title === student.course);
            if (enrolledCourse) {
                formData.value.programId = enrolledCourse.id;
            }
        }
    }
}

// Payment Type Logic
watch(() => formData.value.paymentType, (newType) => {
    if (newType === 'Cicilan' && formData.value.installments.length === 0) {
        addInstallment()
    } else if (newType === 'Lunas') {
        formData.value.installments = []
    }
})

// Installment Logic
const addInstallment = () => {
    const count = formData.value.installments.length
    let lastDueDate = formData.value.publishDate
    let lastPublishDate = formData.value.publishDate

    if (count > 0) {
        const lastItem = formData.value.installments[count - 1]
        if (lastItem) {
            lastDueDate = lastItem.dueDate
            lastPublishDate = lastItem.publishDate
        }
    }

    // Helper to add one month
    const addMonth = (dateStr: string) => {
        const d = new Date(dateStr)
        d.setMonth(d.getMonth() + 1)
        return d.toISOString().slice(0, 10)
    }

    formData.value.installments.push({
        dueDate: count === 0 ? formData.value.publishDate : addMonth(lastDueDate),
        publishDate: count === 0 ? formData.value.publishDate : addMonth(lastPublishDate),
        amount: 0
    })
    recalculateInstallments()
}

const removeInstallment = (index: number) => {
    formData.value.installments.splice(index, 1)
    recalculateInstallments()
}

const recalculateInstallments = () => {
    const count = formData.value.installments.length
    if (count > 0 && formData.value.courseFee > 0) {
        const amountPerInstallment = Math.floor(formData.value.courseFee / count)
        formData.value.installments.forEach(inst => inst.amount = amountPerInstallment)
    }
}

watch(() => formData.value.courseFee, () => {
    if (formData.value.paymentType === 'Cicilan') {
        recalculateInstallments()
    }
})

const handleSubmit = async () => {
    if (!formData.value.studentId || !formData.value.programId) {
        alert('Please select student and course');
        return;
    }

    isSubmitting.value = true
    try {
        const payload = {
          studentId: formData.value.studentId,
          programId: formData.value.programId,
          publishDate: formData.value.publishDate,
          amount: formData.value.courseFee,
          deadline: (formData.value.paymentType === 'Cicilan' && formData.value.installments.length > 0) 
            ? formData.value.installments[0]!.dueDate 
            : new Date().toISOString().slice(0, 10),
          paymentType: formData.value.paymentType,
          installments: formData.value.installments,
          invoiceNo: formData.value.invoiceNo
        };
        emit('submit', payload)
    } catch (e) {
        console.error(e)
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
      <!-- Sticky Header -->
      <div class="p-4 md:p-8 py-4 md:py-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <h3 class="text-2xl font-bold text-gray-900">Create Bill</h3>
        <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Scrollable Form Body -->
      <div class="p-4 md:p-8 overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Top Info Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 bg-gray-50/50 p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Transaction ID</label>
                    <div class="text-sm md:text-base font-bold text-gray-900">Auto Generated</div>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bill Date / Send Date</label>
                    <input 
                        v-model="formData.publishDate"
                        type="date"
                        class="text-sm md:text-base font-bold text-gray-900 bg-transparent border-none p-0 focus:ring-0 w-full"
                    >
                </div>
                <div class="col-span-1">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">No Invoice</label>
                    <div class="text-sm md:text-base font-bold text-gray-900 tracking-tight">{{ formData.invoiceNo }}</div>
                </div>
            </div>

            <div class="space-y-6">
                <!-- Selections Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">Student Name</label>
                        <CustomDropdown 
                            v-model="formData.studentId"
                            :options="studentOptions"
                            label-key="name"
                            value-key="id"
                            placeholder="Select Student"
                            @change="handleStudentChange"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">Specific Level</label>
                        <CustomDropdown 
                            v-model="formData.programId"
                            :options="courseOptions"
                            label-key="title"
                            value-key="id"
                            placeholder="Select Level"
                        />
                    </div>
                </div>

                <!-- Fee & Payment Type Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">Course Fee</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                            <input 
                                v-model.number="formData.courseFee"
                                type="number" 
                                placeholder="0"
                                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 text-gray-700 font-bold"
                            >
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">Payment Type</label>
                        <div class="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
                            <button 
                                type="button"
                                @click="formData.paymentType = 'Lunas'"
                                class="py-2.5 rounded-md text-xs font-bold transition-all"
                                :class="formData.paymentType === 'Lunas' ? 'bg-[#4FD1C5] text-white shadow-sm' : 'text-gray-500 hover:bg-white'"
                            >
                                PAID FULL
                            </button>
                            <button 
                                type="button"
                                @click="formData.paymentType = 'Cicilan'"
                                class="py-2.5 rounded-md text-xs font-bold transition-all"
                                :class="formData.paymentType === 'Cicilan' ? 'bg-[#4FD1C5] text-white shadow-sm' : 'text-gray-500 hover:bg-white'"
                            >
                                INSTALLMENT
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Installments -->
                <div v-if="formData.paymentType === 'Cicilan'" class="space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div class="flex items-center justify-between">
                        <h4 class="text-sm font-bold text-gray-900 border-l-4 border-[#4FD1C5] pl-3">Installment Plan</h4>
                        <button 
                            type="button" 
                            @click="addInstallment"
                            class="text-xs font-bold text-[#4FD1C5] hover:text-[#3dbdb0] flex items-center gap-1 transition-colors"
                        >
                            <Plus class="w-3 h-3" /> Add Installment
                        </button>
                    </div>

                    <div class="space-y-3">
                        <div 
                            v-for="(installment, index) in formData.installments" 
                            :key="index"
                            class="group bg-gray-50 hover:bg-gray-100 cursor-default p-4 rounded-xl border border-gray-100 transition-all flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300"
                        >
                            <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-100">
                                {{ index + 1 }}
                            </div>
                            <div class="flex-1 relative">
                                <label class="block text-[8px] font-bold text-gray-400 uppercase mb-1">Due Date</label>
                                <input 
                                    v-model="installment.dueDate"
                                    type="date"
                                    class="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/30 text-xs font-medium"
                                >
                            </div>
                            <div class="flex-1 relative">
                                <label class="block text-[8px] font-bold text-gray-400 uppercase mb-1">Send Date</label>
                                <input 
                                    v-model="installment.publishDate"
                                    type="date"
                                    class="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/30 text-xs font-medium"
                                >
                            </div>
                            <div class="flex-1 relative">
                                <label class="block text-[8px] font-bold text-gray-400 uppercase mb-1">Amount</label>
                                <span class="absolute left-3 top-[calc(100%-24px)] -translate-y-1/2 text-gray-400 text-[10px] font-bold">Rp</span>
                                <input 
                                    v-model.number="installment.amount"
                                    type="number"
                                    class="w-full pl-8 pr-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/30 text-xs font-bold"
                                >
                            </div>
                            <button 
                                type="button"
                                @click="removeInstallment(index)"
                                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
      </div>

      <!-- Sticky Footer Actions -->
      <div class="p-6 md:p-8 border-t border-gray-100 bg-white flex justify-end">
        <button
          type="button"
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="w-full py-3 rounded-lg text-white font-medium transition-colors bg-[#4FD1C5] hover:bg-[#3dbdb0] disabled:bg-gray-200 flex justify-center items-center gap-2 shadow-lg shadow-[#4FD1C5]/20"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <span>{{ isSubmitting ? 'Processing...' : 'Create Bill' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>