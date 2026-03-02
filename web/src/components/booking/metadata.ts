export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'datetime';

export interface FormField {
    id: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    options?: string[];
    required: boolean;
    defaultValue?: any;
}

export interface RequestTypeConfig {
    label: string;           // Human-readable display name
    primaryAction: string;
    fields: FormField[];
}

export interface DomainMetadata {
    domain: string;
    label: string;
    icon: string;
    // Roles that can access this domain's booking
    allowedRoles: string[];
    requestTypes: {
        [key: string]: RequestTypeConfig;
    };
}

export const BOOKING_METADATA: DomainMetadata[] = [
    {
        domain: 'TRANSPORT',
        label: 'Transport',
        icon: '🚘',
        allowedRoles: ['PASSENGER', 'CORPORATE', 'ADMIN', 'SUPER_ADMIN'],
        requestTypes: {
            'TAXI': {
                label: 'Taxi',
                primaryAction: 'Book Taxi',
                fields: [
                    { id: 'vehicle_class', label: 'Vehicle Class', type: 'select', options: ['Economy', 'Premium', 'XL'], required: true },
                    { id: 'passenger_count', label: 'Passengers', type: 'number', defaultValue: 1, required: true },
                    { id: 'luggage_count', label: 'Luggage Count', type: 'number', defaultValue: 0, required: false },
                ],
            },
            'LIMOUSINE': {
                label: 'Limousine',
                primaryAction: 'Request Limousine',
                fields: [
                    { id: 'luxury_tier', label: 'Luxury Tier', type: 'select', options: ['Business', 'First Class', 'Royal'], required: true },
                    { id: 'meet_and_greet', label: 'Meet & Greet Required', type: 'checkbox', required: false },
                    { id: 'passenger_count', label: 'Passengers', type: 'number', defaultValue: 1, required: true },
                ],
            },
            'SCHOOL_BUS': {
                label: 'School Bus',
                primaryAction: 'Schedule School Bus',
                fields: [
                    { id: 'student_count', label: 'Students', type: 'number', defaultValue: 1, required: true },
                    { id: 'route_name', label: 'Route Name', type: 'text', placeholder: 'e.g. Route A – Al Mankhool', required: true },
                ],
            },
            'SHUTTLE': {
                label: 'Corporate Shuttle',
                primaryAction: 'Book Shuttle',
                fields: [
                    { id: 'department', label: 'Department', type: 'text', placeholder: 'Engineering', required: true },
                    { id: 'shift', label: 'Shift', type: 'select', options: ['Morning', 'Afternoon', 'Night'], required: true },
                    { id: 'seats', label: 'Seats', type: 'number', defaultValue: 1, required: true },
                ],
            },
            'CAR_RENTAL': {
                label: 'Car Rental',
                primaryAction: 'Reserve Vehicle',
                fields: [
                    { id: 'rental_days', label: 'Rental Days', type: 'number', defaultValue: 1, required: true },
                    { id: 'vehicle_class', label: 'Vehicle Class', type: 'select', options: ['Economy', 'SUV', 'Luxury', 'Electric'], required: true },
                    { id: 'with_driver', label: 'With Driver', type: 'checkbox', required: false },
                ],
            },
        },
    },
    {
        domain: 'EMERGENCY',
        label: 'Emergency',
        icon: '🚑',
        allowedRoles: ['EMS_OPERATOR', 'GOVT_EMS', 'ADMIN', 'SUPER_ADMIN'],
        requestTypes: {
            'AMBULANCE': {
                label: 'Ambulance',
                primaryAction: 'Dispatch Ambulance',
                fields: [
                    { id: 'incident_category', label: 'Incident Category', type: 'select', options: ['Cardiac', 'Trauma', 'Respiratory', 'Maternity', 'Other'], required: true },
                    { id: 'patient_condition', label: 'Patient Condition', type: 'select', options: ['Stable', 'Critical', 'Unconscious'], required: true },
                    { id: 'priority', label: 'Mission Priority', type: 'select', options: ['P1 – Critical', 'P2 – Urgent', 'P3 – Standard'], required: true, defaultValue: 'P2 – Urgent' },
                    { id: 'med_support', label: 'ALS Support Required', type: 'checkbox', required: false },
                ],
            },
            'INCIDENT': {
                label: 'Incident',
                primaryAction: 'Report Incident',
                fields: [
                    { id: 'incident_type', label: 'Incident Type', type: 'select', options: ['Road Accident', 'Fire', 'Traffic Block', 'Flooding', 'Other'], required: true },
                    { id: 'severity', label: 'Severity', type: 'select', options: ['Minor', 'Major', 'Critical'], required: true },
                    { id: 'photo_evidence', label: 'Photo/Video Evidence', type: 'checkbox', required: false },
                ],
            },
        },
    },
];

// Role → allowed domains mapping
export const ROLE_DOMAIN_ACCESS: Record<string, string[]> = {
    PASSENGER: ['TRANSPORT'],
    CORPORATE: ['TRANSPORT'],
    EMS_OPERATOR: ['EMERGENCY'],
    GOVT_EMS: ['EMERGENCY'],
    FLEET_ADMIN: ['TRANSPORT'],
    ADMIN: ['TRANSPORT', 'EMERGENCY'],
    SUPER_ADMIN: ['TRANSPORT', 'EMERGENCY'],
};
