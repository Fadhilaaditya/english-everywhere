import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    private getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    async getTeacherProfile(): Promise<TeacherProfile> {
        try {
            const response = await axios.get(`${API_URL}/teacher/profile`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching teacher profile:", error);
            throw error;
        }
    }

    async getMySchedules(): Promise<Schedule[]> {
        try {
            const response = await axios.get(`${API_URL}/teacher-schedules/my-schedules`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching my schedules:", error);
            throw error;
        }
    }

    async getSchedules(teacherId: number): Promise<Schedule[]> {
        try {
            const response = await axios.get(`${API_URL}/teacher-schedules`, {
                headers: this.getHeaders(),
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
            const response = await axios.post(`${API_URL}/teacher-schedules`, data, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error("Error creating schedule:", error);
            throw error;
        }
    }

    async updateSchedule(id: number, data: Partial<Schedule>): Promise<Schedule> {
        try {
            const response = await axios.put(`${API_URL}/teacher-schedules/${id}`, data, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error("Error updating schedule:", error);
            throw error;
        }
    }

    async deleteSchedule(id: number): Promise<{ message: string }> {
        try {
            const response = await axios.delete(`${API_URL}/teacher-schedules/${id}`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting schedule:", error);
            throw error;
        }
    }
}

export default new TeacherScheduleService();
