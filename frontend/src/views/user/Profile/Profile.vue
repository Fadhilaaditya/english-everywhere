<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap, Briefcase, FileText } from 'lucide-vue-next'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(true)
const profileData = ref<any>(null)
const errorMsg = ref('')

const fetchProfile = async () => {
    isLoading.value = true
    errorMsg.value = ''
    try {
        const userDataStr = localStorage.getItem('user')
        if (!userDataStr) {
            router.push('/login')
            return
        }
        
        const currentUser = JSON.parse(userDataStr)
        const response = await axios.get(`http://localhost:3001/api/users/${currentUser.id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token') || ''
            }
        })
        
        profileData.value = response.data
    } catch (err: any) {
        console.error('Failed to fetch profile', err)
        errorMsg.value = err.response?.data?.message || 'Failed to load profile data.'
    } finally {
        isLoading.value = false
    }
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(() => {
    fetchProfile()
})
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-poppins min-h-[80vh]">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FD1C5]"></div>
    </div>
    
    <div v-else-if="errorMsg" class="bg-red-50 text-red-600 p-4 rounded-xl text-center">
        {{ errorMsg }}
    </div>

    <div v-else-if="profileData" class="space-y-6">
        <!-- Header Profile -->
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div class="h-32 bg-gradient-to-r from-[#4FD1C5] to-[#4FD1C5]/70"></div>
            <div class="px-8 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 relative z-10">
                <div class="w-24 h-24 rounded-full border-4 border-white bg-[#EFF2FC] flex items-center justify-center shadow-md overflow-hidden shrink-0">
                    <img v-if="profileData.photo" :src="profileData.photo" alt="Profile" class="w-full h-full object-cover" />
                    <User v-else class="w-12 h-12 text-[#4FD1C5]" />
                </div>
                <div class="flex-1 text-center sm:text-left">
                    <h1 class="text-2xl font-bold text-gray-900">{{ profileData.fullName }}</h1>
                    <p class="text-gray-500 font-medium">@{{ profileData.username }}</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider"
                          :class="profileData.role === 'teacher' ? 'bg-[#FFE2CC] text-[#E06C00]' : 'bg-[#E3F2FD] text-[#1976D2]'">
                        {{ profileData.role === 'user' ? 'Student' : profileData.role }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Detail Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Basic Info -->
            <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
                <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User class="w-5 h-5 text-[#4FD1C5]" />
                    Informasi Dasar
                </h2>
                
                <div class="space-y-5">
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                            <Mail class="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                            <p class="text-gray-900 font-medium break-all">
                                {{ profileData.studentProfile?.email || profileData.teacherProfile?.email || '-' }}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                            <Phone class="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">No. Handphone</p>
                            <p class="text-gray-900 font-medium">
                                {{ profileData.studentProfile?.phoneNumber || profileData.teacherProfile?.phoneNumber || '-' }}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                            <Calendar class="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tanggal Lahir</p>
                            <p class="text-gray-900 font-medium">
                                {{ formatDate(profileData.studentProfile?.birthDate || profileData.teacherProfile?.birthDate) }}
                            </p>
                        </div>
                    </div>

                     <div class="flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                            <User class="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Jenis Kelamin</p>
                            <p class="text-gray-900 font-medium">
                                {{ profileData.studentProfile?.gender || profileData.teacherProfile?.gender || '-' }}
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                            <MapPin class="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Alamat</p>
                            <p class="text-gray-900 font-medium">
                                {{ profileData.studentProfile?.address || profileData.teacherProfile?.address || '-' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Role Specific Info -->
            <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
                <template v-if="profileData.role === 'student' || profileData.role === 'user'">
                    <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <GraduationCap class="w-5 h-5 text-[#4FD1C5]" />
                        Informasi Akademik
                    </h2>
                    
                    <div class="space-y-5">
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                <BookOpen class="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Program Kursus</p>
                                <p class="text-gray-900 font-bold text-lg">
                                    {{ profileData.studentProfile?.course || 'Belum terdaftar di program apapun' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else-if="profileData.role === 'teacher'">
                    <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Briefcase class="w-5 h-5 text-[#4FD1C5]" />
                        Informasi Profesional
                    </h2>
                    
                    <div class="space-y-5">
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                <GraduationCap class="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Spesialisasi</p>
                                <p class="text-gray-900 font-bold">
                                    {{ profileData.teacherProfile?.specialization || 'Belum diatur' }}
                                </p>
                            </div>
                        </div>

                         <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                                <FileText class="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Biografi (Bio)</p>
                                <p class="text-gray-900 leading-relaxed text-sm">
                                    {{ profileData.teacherProfile?.bio || 'Belum ada deskripsi biografi yang ditulis.' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
  </div>
</template>
