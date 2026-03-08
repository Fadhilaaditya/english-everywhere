import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default {
  // === Admin Endpoints ===
  
  // Get all payments for admin table
  async getAllPayments() {
    const response = await axios.get(`${API_URL}/payments`);
    return response.data;
  },

  // Create new bill (Lunas or Cicilan)
  async createPayment(paymentData: any) {
    const response = await axios.post(`${API_URL}/payments`, paymentData);
    return response.data;
  },

  // Approve payment (mark as Success)
  async approvePayment(id: number, isInstallment: boolean = false) {
    const response = await axios.put(`${API_URL}/payments/${id}/approve`, {
      isInstallment
    });
    return response.data;
  },

  // Delete payment
  async deletePayment(id: number) {
    const response = await axios.delete(`${API_URL}/payments/${id}`);
    return response.data;
  },

  // === User Endpoints ===
  
  // Get payments by student ID
  async getUserPayments(studentId: number) {
    const response = await axios.get(`${API_URL}/payments/user/${studentId}`);
    return response.data;
  },

  // Confirm payment via WA (marks status as waiting/confirmed if needed)
  async confirmPayment(id: number, isInstallment: boolean = false) {
    const response = await axios.put(`${API_URL}/payments/${id}/confirm`, {
      isInstallment
    });
    return response.data;
  }
};
