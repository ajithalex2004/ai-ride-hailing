import { NextRequest, NextResponse } from 'next/server';

// Mock dispatch engine responses per domain
const MOCK_RESPONSES: Record<string, object> = {
    EMERGENCY: {
        trip_id: `EMG-${Date.now()}`,
        status: 'DISPATCHED',
        domain: 'EMERGENCY',
        priority: 'P1',
        eta_minutes: Math.floor(Math.random() * 4) + 5,
        assigned_ambulance: 'AMB-Dubai-042',
        assigned_crew: ['Paramedic: Ahmed Al-Rashid', 'Driver: Khalid Hassan'],
        destination_hospital: 'Dubai Health Authority – Sheikh Khalifa Medical City',
        message: '🚨 P1 Emergency dispatch confirmed. Ambulance en route.',
    },
    TRANSPORT: {
        trip_id: `TRP-${Date.now()}`,
        status: 'MATCHED',
        domain: 'TRANSPORT',
        priority: 'STANDARD',
        eta_minutes: Math.floor(Math.random() * 5) + 3,
        assigned_driver: 'Mohammed Al-Farsi',
        driver_rating: 4.9,
        vehicle: 'Toyota Camry • Dubai D-3847',
        fare_estimate_aed: (Math.random() * 30 + 15).toFixed(2),
        message: '✅ Driver matched. Arriving shortly.',
    },
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const domain = body.domain || 'TRANSPORT';

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        const response = {
            ...MOCK_RESPONSES[domain] || MOCK_RESPONSES['TRANSPORT'],
            request_type: body.request_type,
            pickup_address: body.pickup_address,
            dropoff_address: body.dropoff_address,
            timestamp: new Date().toISOString(),
            tenant: 'dubai-ops',
            processed_by: 'AI Dispatch Oracle v2.9 • EXL Solutions',
        };

        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to process booking request', details: String(err) },
            { status: 500 }
        );
    }
}
