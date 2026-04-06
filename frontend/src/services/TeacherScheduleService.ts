import api from '@/api';

export interface TeacherProfile {
    id: number;
    userId: number;
    bio?: string;
    specialization?: string;
    // Add other profile fields if necessary
}

export interface Schedule {
    id: number;
    teacherId: number;
    programId: number;
    day: string;
    startTime: string;
    endTime: string;
    status: string;
    program?: {
        id: number;
        name: string;
        [key: string]: any;
    };
    [key: string]: any;
}

class TeacherScheduleService {
    async getTeacherProfile(): Promise<TeacherProfile> {
        try {
            const response = await api.get('/teacher/profile');
            return response.data;
        } catch (error) {
            console.error("Error fetching teacher profile:", error);
            throw error;
        }
    }

    async getMySchedules(): Promise<Schedule[]> {
        try {
            const response = await api.get('/teacher-schedules/my-schedules');
            return response.data;
        } catch (error) {
            console.error("Error fetching my schedules:", error);
            throw error;
        }
    }

    async getSchedules(teacherId: number): Promise<Schedule[]> {
        try {
            const response = await api.get('/teacher-schedules', {
                params: { teacherId }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching schedules:", error);
            throw error;
        }
    }

    async createSchedule(data: Partial<Schedule>): Promise<Schedule> {
        try {
            const response = await api.post('/teacher-schedules', data);
            return response.data;
        } catch (error) {
            console.error("Error creating schedule:", error);
            throw error;
        }
    }

    async updateSchedule(id: number, data: Partial<Schedule>): Promise<Schedule> {
        try {
            const response = await api.put(`/teacher-schedules/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating schedule:", error);
            throw error;
        }
    }

    async deleteSchedule(id: number): Promise<{ message: string }> {
        try {
            const response = await api.delete(`/teacher-schedules/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting schedule:", error);
            throw error;
        }
    }
}

export default new TeacherScheduleService();
