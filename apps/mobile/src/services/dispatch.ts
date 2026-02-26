import { DISPATCH_BASE_URL } from './config';

export const dispatchService = {
    matchDriver: async (rideId: string, lat: number, lng: number, category: string) => {
        try {
            const response = await fetch(`${DISPATCH_BASE_URL}/dispatch/match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ride_id: rideId,
                    lat,
                    lng,
                    category,
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Dispatch Match Error:', error);
            throw error;
        }
    },
};
