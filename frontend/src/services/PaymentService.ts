import api from '@/api';

export default {
  // === Admin Endpoints ===

  // Get all payments for admin table with optional pagination and search
  async getAllPayments(params?: any) {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  // Get payment global stats
  async getPaymentStats() {
    const response = await api.get('/payments/admin/stats');
    return response.data;
  },

  // Create new bill (Lunas or Cicilan)
  async createPayment(paymentData: any) {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  // Approve payment (mark as Success)
  async approvePayment(id: number, isInstallment: boolean = false) {
    const response = await api.put(`/payments/${id}/approve`, {
      isInstallment
    });
    return response.data;
  },

  // Delete payment
  async deletePayment(id: number) {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },

  // === User Endpoints ===

  // Get payments by student ID
  async getUserPayments(studentId: number) {
    const response = await api.get(`/payments/user/${studentId}`);
    return response.data;
  },

  // Confirm payment via WA (marks status as waiting/confirmed if needed)
  async confirmPayment(id: number, isInstallment: boolean = false) {
    const response = await api.put(`/payments/${id}/confirm`, {
      isInstallment
    });
    return response.data;
  }
};
