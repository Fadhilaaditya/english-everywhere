<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { X, Plus, Calendar, Trash2, ChevronDown } from 'lucide-vue-next'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits(['close', 'submit'])

// Form Data
const formData = ref({
    billDate: new Date().toLocaleDateString('en-GB'),
    invoiceNo: `INV/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000)}`, 
    studentId: null as number | null,
    studentName: '',
    programId: null as number | null,
    courseName: '',
    courseFee: 0,
    paymentType: 'Lunas' as 'Lunas' | 'Cicilan',
    installments: [] as { dueDate: string, amount: number }[]
})

// Real Data state
const students = ref<any[]>([])
const courses = ref<any[]>([])

const fetchInitialData = async () => {
  try {
    const [studentsRes, programsRes] = await Promise.all([
      axios.get(`${API_URL}/students`),
      axios.get(`${API_URL}/programs`)
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

const showStudentSearch = ref(false)
const showCourseSearch = ref(false)

const filteredStudents = computed(() => {
    return students.value.filter(s => s.name.toLowerCase().includes(formData.value.studentName.toLowerCase()))
})

const filteredCourses = computed(() => {
    return courses.value.filter(c => c.title.toLowerCase().includes(formData.value.courseName.toLowerCase()))
})

const selectStudent = (student: any) => {
    formData.value.studentId = student.id
    formData.value.studentName = student.name
    showStudentSearch.value = false
}

const selectCourse = (course: any) => {
    formData.value.programId = course.id
    formData.value.courseName = course.title
    showCourseSearch.value = false
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
    formData.value.installments.push({
        dueDate: new Date().toISOString().slice(0, 10),
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

const handleSubmit = () => {
    const payload = {
      studentId: formData.value.studentId,
      programId: formData.value.programId,
      amount: formData.value.courseFee,
      deadline: new Date().toISOString().slice(0, 10), // For Lunas, mostly. Alternatively use real Date Picker for deadline
      paymentType: formData.value.paymentType,
      installments: formData.value.installments,
      invoiceNo: formData.value.invoiceNo
    };
    emit('submit', payload)
    
    // Reset form briefly
    formData.value.studentId = null;
    formData.value.studentName = '';
    formData.value.programId = null;
    formData.value.courseName = '';
    formData.value.courseFee = 0;
    formData.value.installments = [];
    emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900">Create Bill</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6 md:p-8 space-y-6 md:space-y-8">
        <!-- Top Info -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div>
                <label class="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1">Transaction ID</label>
                <div class="text-sm md:text-lg font-bold text-gray-900">Auto Generated</div>
            </div>
            <div>
                <label class="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1">Bill Date</label>
                <div class="text-sm md:text-lg font-bold text-gray-900">{{ formData.billDate }}</div>
            </div>
            <div class="col-span-2 md:col-span-1">
                <label class="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1">No Invoice</label>
                <div class="text-sm md:text-lg font-bold text-gray-900">{{ formData.invoiceNo }}</div>
            </div>
        </div>

        <!-- Inputs -->
        <div class="space-y-6">
            <!-- Student Search -->
            <div class="relative">
                <label class="block text-sm font-bold text-gray-700 mb-2">Nama Murid<span class="text-red-500">*</span></label>
                <div class="relative">
                    <input 
                        v-model="formData.studentName"
                        @input="showStudentSearch = true"
                        type="text" 
                        placeholder="Pilih Murid"
                        class="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10 transition-all outline-none font-medium"
                    >
                    <button 
                        @click="showStudentSearch = !showStudentSearch"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4FD1C5] transition-colors p-1"
                    >
                        <ChevronDown class="w-5 h-5" />
                    </button>
                </div>
                
                <div v-if="showStudentSearch && filteredStudents.length > 0" class="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                    <div 
                        v-for="student in filteredStudents" 
                        :key="student.id"
                        @click="selectStudent(student)"
                        class="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 transition-colors"
                    >
                        {{ student.name }}
                    </div>
                </div>
            </div>

            <!-- Course Search -->
            <div class="relative">
                <label class="block text-sm font-bold text-gray-700 mb-2">Course Name<span class="text-red-500">*</span></label>
                <div class="relative">
                    <input 
                        v-model="formData.courseName"
                        @input="showCourseSearch = true"
                        type="text" 
                        placeholder="Pilih Program"
                        class="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10 transition-all outline-none font-medium"
                    >
                    <button 
                         @click="showCourseSearch = !showCourseSearch"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4FD1C5] transition-colors p-1"
                    >
                        <ChevronDown class="w-5 h-5" />
                    </button>
                </div>

                <div v-if="showCourseSearch && filteredCourses.length > 0" class="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                    <div 
                        v-for="course in filteredCourses" 
                        :key="course.id"
                        @click="selectCourse(course)"
                        class="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 transition-colors"
                    >
                        {{ course.title }}
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <h3 class="text-sm font-bold text-gray-900">Termin Pembayaran</h3>
                
                <!-- Fee -->
                <div>
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Biaya Kelas<span class="text-red-500">*</span></label>
                    <input 
                        v-model.number="formData.courseFee"
                        type="number" 
                        placeholder="0"
                        class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10 transition-all outline-none font-medium"
                    >
                </div>

                <!-- Payment Type -->
                <div>
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Jenis Pembayaran<span class="text-red-500">*</span></label>
                    <div class="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl">
                        <button 
                            @click="formData.paymentType = 'Lunas'"
                            class="py-2.5 rounded-lg text-sm font-bold transition-all"
                            :class="formData.paymentType === 'Lunas' ? 'bg-[#4FD1C5] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'"
                        >
                            Lunas
                        </button>
                        <button 
                            @click="formData.paymentType = 'Cicilan'"
                            class="py-2.5 rounded-lg text-sm font-bold transition-all"
                            :class="formData.paymentType === 'Cicilan' ? 'bg-[#4FD1C5] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'"
                        >
                            Cicilan
                        </button>
                    </div>
                </div>

                <!-- Installments Section -->
                <div v-if="formData.paymentType === 'Cicilan'" class="space-y-4 pt-2">
                    <div 
                        v-for="(installment, index) in formData.installments" 
                        :key="index"
                        class="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-end group relative"
                    >
                        <div class="flex-1">
                            <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Cicilan {{ index + 1 }}</label>
                            <input 
                                v-model="installment.dueDate"
                                type="date"
                                class="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 focus:border-[#4FD1C5] outline-none text-sm font-medium"
                            >
                        </div>
                        <div class="flex-1">
                            <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Jumlah</label>
                            <input 
                                v-model.number="installment.amount"
                                type="number"
                                class="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 focus:border-[#4FD1C5] outline-none text-sm font-medium"
                            >
                        </div>
                        <button 
                            @click="removeInstallment(index)"
                            class="p-2.5 text-red-400 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors self-end sm:self-auto"
                        >
                            <Trash2 class="w-5 h-5" />
                        </button>
                    </div>

                     <button 
                        @click="addInstallment"
                        class="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold hover:border-[#4FD1C5] hover:text-[#4FD1C5] transition-all flex items-center justify-center gap-2"
                    >
                        <Plus class="w-5 h-5" />
                        Tambah Cicilan
                    </button>
                </div>
            </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 md:p-8 border-t border-gray-100 sticky bottom-0 bg-white z-10">
        <button 
            @click="handleSubmit"
            class="w-full py-3 md:py-4 bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white rounded-xl font-bold text-base md:text-lg shadow-lg shadow-[#4FD1C5]/20 transition-all active:scale-[0.99]"
        >
            Create Bill
        </button>
      </div>
    </div>
  </div>
</template>