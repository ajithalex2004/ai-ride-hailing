export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'datetime';

export interface FormField {
    id: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    options?: string[]; // For select type
    required: boolean;
    defaultValue?: any;
}

export interface DomainMetadata {
    domain: string;
    requestTypes: {
        [key: string]: {
            fields: FormField[];
            primaryAction: string;
        };
    };
}

export const BOOKING_METADATA: DomainMetadata[] = [
    {
        domain: 'TRANSPORT',
        requestTypes: {
            'TAX_TAXI': {
                primaryAction: 'Book Taxi',
                fields: [
                    { id: 'vehicle_class', label: 'Vehicle Class', type: 'select', options: ['Economy', 'Premium', 'XL'], required: true },
                    { id: 'passenger_count', label: 'Passengers', type: 'number', defaultValue: 1, required: true },
                    { id: 'luggage_count', label: 'Luggage Count', type: 'number', defaultValue: 0, required: false },
                ]
            },
            'LIM_LIMO': {
                primaryAction: 'Request Limousine',
                fields: [
                    { id: 'luxury_tier', label: 'Luxury Tier', type: 'select', options: ['Business', 'First Class', 'Royal'], required: true },
                    { id: 'meet_and_greet', label: 'Meet & Greet Required', type: 'checkbox', required: false },
                ]
            }
        }
    },
    {
        domain: 'EMERGENCY',
        requestTypes: {
            'AMB_AMBULANCE': {
                primaryAction: 'Dispatch Ambulance',
                fields: [
                    { id: 'incident_category', label: 'Incident Category', type: 'select', options: ['Cardiac', 'Trauma', 'Respiratory', 'Maternity', 'Other'], required: true },
                    { id: 'patient_condition', label: 'Patient Condition', type: 'select', options: ['Stable', 'Critical', 'Unconscious'], required: true },
                    { id: 'priority', label: 'Mission Priority', type: 'select', options: ['P1 (Critical)', 'P2 (Urgent)', 'P3 (Standard)'], required: true, defaultValue: 'P2 (Urgent)' },
                    { id: 'med_support', label: 'Medical Support Required', type: 'checkbox', required: false },
                ]
            },
            'INC_INCIDENT': {
                primaryAction: 'Report Incident',
                fields: [
                    { id: 'incident_type', label: 'Incident Type', type: 'select', options: ['Road Accident', 'Fire', 'Traffic Block'], required: true },
                    { id: 'media_upload', label: 'Photo/Video Evidence', type: 'checkbox', required: false }, // Simplification for mock
                ]
            }
        }
    }
];
