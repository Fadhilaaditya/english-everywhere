import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

class TeacherScheduleService {
    getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'x-access-token': token
        };
    }

    async getTeacherProfile() {
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

    async getSchedules(teacherId) {
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

    async createSchedule(data) {
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

    async updateSchedule(id, data) {
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

    async deleteSchedule(id) {
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
