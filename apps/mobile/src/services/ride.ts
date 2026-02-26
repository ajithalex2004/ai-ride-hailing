import { RIDE_BASE_URL } from './config';

export const rideService = {
    createRide: async (passengerId: string, pickup: string, destination: string, category: string) => {
        try {
            const response = await fetch(`${RIDE_BASE_URL}/rides`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    passenger_id: passengerId,
                    pickup_address: pickup,
                    destination_address: destination,
                    category,
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Ride Creation Error:', error);
            throw error;
        }
    },
    getRideStatus: async (rideId: string) => {
        const response = await fetch(`${RIDE_BASE_URL}/rides/${rideId}`);
        return await response.json();
    }
};
