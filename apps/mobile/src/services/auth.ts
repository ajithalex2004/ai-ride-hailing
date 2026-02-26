import { apiClient } from './api';

export const authService = {
    login: async (phoneNumber: string) => {
        return await apiClient.post('/auth/login', { phone_number: phoneNumber });
    },
    verifyOTP: async (phoneNumber: string, otp: string) => {
        return await apiClient.post('/auth/verify-otp', { phone_number: phoneNumber, otp });
    },
};
