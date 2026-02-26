import { API_BASE_URL } from './config';

export const apiClient = {
    post: async (endpoint: string, data: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return await response.json();
        } catch (error) {
            console.error(`API Post Error [${endpoint}]:`, error);
            throw error;
        }
    },
};
