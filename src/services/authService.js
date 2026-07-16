import axiosInstance from './axiosInstance.js';

export const authService = {
  signup: async (name, email, password) => {
    return await axiosInstance.post('/auth/signup', { name, email, password });
  },

  login: async (email, password) => {
    return await axiosInstance.post('/auth/login', { email, password });
  },

  logout: async () => {
    return await axiosInstance.post('/auth/logout');
  },

  refresh: async () => {
    return await axiosInstance.post('/auth/refresh');
  },

  verifyOtp: async (email, otp) => {
    return await axiosInstance.post('/auth/verify-otp', { email, otp });
  },

  forgotPassword: async (email) => {
    return await axiosInstance.post('/auth/forgot-password', { email });
  },

  resetPassword: async (email, otp, newPassword) => {
    return await axiosInstance.post('/auth/reset-password', { email, otp, newPassword });
  },
};
