<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { X, Plus, Calendar, Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'success'])

const students = ref<any[]>([])
const programs = ref<any[]>([])
const isSubmitting = ref(false)

const formData = ref({
  transactionId: '001/XIV', // Dummy for now
  billDate: new Date().toLocaleDateString('en-GB'),
  invoiceNo: 'EE/123/123',
  studentId: '',
  programId: '',
  biayaKelas: 0,
  paymentType: 'lunas', // 'lunas' or 'cicilan'
  installments: [] as { label: string, amount: number, date: string }[]
})


const fetchDropdownData = async () => {
  try {
    const [studentsRes, programsRes] = await Promise.all([
      fetch('http://localhost:3001/api/students'),
      fetch('http://localhost:3001/api/programs')
    ])
    if (studentsRes.ok) students.value = await studentsRes.json()
    if (programsRes.ok) programs.value = await programsRes.json()
  } catch (err) {
    console.error('Failed to fetch dropdown data', err)
  }
}

const addInstallment = () => {
  const count = formData.value.installments.length + 1
  formData.value.installments.push({
    label: `Cicilan ${count}`,
    amount: 0,
    date: new Date().toISOString().slice(0, 10)
  })
}

const removeInstallment = (index: number) => {
  formData.value.installments.splice(index, 1)
  // Re-label
  formData.value.installments.forEach((inst, i) => {
    inst.label = `Cicilan ${i + 1}`
  })
}

const handleSubmit = async () => {
    isSubmitting.value = true
    // Logic to save payment...
    setTimeout(() => {
        isSubmitting.value = false
        emit('success', 'Bill created successfully')
    }, 1000)
}

onMounted(() => {
  fetchDropdownData()
})
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/30" @click="$emit('close')"></div>
    
    <div class="relative bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-10">
      <button @click="$emit('close')" class="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
        <X class="w-6 h-6" />
      </button>

      <h2 class="text-3xl font-bold text-gray-900 mb-8">Create Bill</h2>

      <!-- Header Info -->
      <div class="grid grid-cols-3 gap-8 mb-10">
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-400 uppercase">Transaction ID</span>
          <span class="text-lg font-bold text-gray-800">{{ formData.transactionId }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-400 uppercase">Bill Date</span>
          <span class="text-lg font-bold text-gray-800">{{ formData.billDate }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-gray-400 uppercase">No Invoice</label>
          <input 
            v-model="formData.invoiceNo"
            type="text"
            class="text-lg font-bold text-gray-800 bg-transparent border-b border-gray-100 focus:border-[#4FD1C5] focus:outline-none transition-all py-0.5"
          />
        </div>
      </div>

      <div class="space-y-6">
        <!-- Student Selection -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Nama Murid<span class="text-red-500">*</span></label>
          <select 
            v-model="formData.studentId"
            class="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled>Pilih Murid</option>
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.name }}
            </option>
          </select>
        </div>

        <!-- Course Selection -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Course Name<span class="text-red-500">*</span></label>
          <select 
            v-model="formData.programId"
            class="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled>Pilih Program</option>
            <option v-for="program in programs" :key="program.id" :value="program.id">
              {{ program.title }}
            </option>
          </select>
        </div>

        <div class="pt-4 border-t border-gray-50">
          <h3 class="text-lg font-bold text-gray-900 mb-6">Termin Pembayaran</h3>
          
          <div class="space-y-2 mb-6">
            <label class="block text-xs font-bold text-gray-500 uppercase">Biaya Kelas<span class="text-red-500">*</span></label>
            <input 
              v-model.number="formData.biayaKelas"
              type="number"
              class="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
            />
          </div>

          <!-- Payment Type Toggle -->
          <div class="space-y-3 mb-6">
            <label class="block text-sm font-semibold text-gray-700">Jenis Pembayaran<span class="text-red-500">*</span></label>
            <div class="flex gap-4">
              <button 
                type="button"
                @click="formData.paymentType = 'lunas'; formData.installments = []"
                class="flex-1 py-3 rounded-2xl font-bold transition-all border"
                :class="formData.paymentType === 'lunas' ? 'bg-[#4FD1C5] text-white border-[#4FD1C5] shadow-lg shadow-[#4FD1C5]/20' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'"
              >
                Lunas
              </button>
              <button 
                type="button"
                @click="formData.paymentType = 'cicilan'"
                class="flex-1 py-3 rounded-2xl font-bold transition-all border"
                :class="formData.paymentType === 'cicilan' ? 'bg-[#4FD1C5] text-white border-[#4FD1C5] shadow-lg shadow-[#4FD1C5]/20' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'"
              >
                Cicilan
              </button>
            </div>
          </div>

          <!-- Installments Section -->
          <div v-if="formData.paymentType === 'cicilan'" class="space-y-4 mb-6">
            <div v-for="(inst, index) in formData.installments" :key="index" class="bg-gray-50 p-4 rounded-3xl border border-gray-100 relative group">
              <button @click="removeInstallment(index)" class="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 class="w-4 h-4" />
              </button>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-xs font-bold text-gray-500 uppercase">{{ inst.label }}</label>
                  <div class="relative">
                    <input 
                      v-model="inst.date"
                      type="date"
                      class="w-full px-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="block text-xs font-bold text-gray-500 uppercase">Jumlah</label>
                  <input 
                    v-model.number="inst.amount"
                    type="number"
                    class="w-full px-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                  />
                </div>
              </div>
            </div>
            <button 
              @click="addInstallment"
              class="w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold hover:border-[#4FD1C5] hover:text-[#4FD1C5] hover:bg-[#4FD1C5]/5 transition-all flex items-center justify-center gap-2"
            >
              <Plus class="w-5 h-5" />
              Tambah Cicilan
            </button>
          </div>
        </div>


        <button 
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="w-full bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white font-bold text-xl py-4 rounded-3xl shadow-xl shadow-[#4FD1C5]/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <span v-if="isSubmitting" class="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ isSubmitting ? 'Processing...' : 'Create Bill' }}
        </button>
      </div>
    </div>
  </div>
</template>