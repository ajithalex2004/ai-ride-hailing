import { PAYMENT_BASE_URL } from './config';

export const paymentService = {
    getWalletBalance: async (userId: string) => {
        try {
            const response = await fetch(`${PAYMENT_BASE_URL}/wallet/${userId}`);
            return await response.json();
        } catch (error) {
            console.error('Get Wallet Balance Error:', error);
            throw error;
        }
    },
    topUpWallet: async (userId: string, amount: number) => {
        try {
            const response = await fetch(`${PAYMENT_BASE_URL}/wallet/topup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    amount,
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Top Up Wallet Error:', error);
            throw error;
        }
    },
    getTransactions: async (userId: string) => {
        const response = await fetch(`${PAYMENT_BASE_URL}/wallet/${userId}/transactions`);
        return await response.json();
    }
};
