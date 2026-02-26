import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { theme } from '../../theme';

import RideCategorySheet from '../../components/RideCategorySheet';
import FindingDriverSheet from '../../components/FindingDriverSheet';
import TripDetailsSheet from '../../components/TripDetailsSheet';
import RideReceiptSheet from '../../components/RideReceiptSheet';
import { rideService } from '../../services/ride';
import { dispatchService } from '../../services/dispatch';
import { useAuthStore } from '../../store/authStore';

const { width, height } = Dimensions.get('window');

interface Vehicle {
    id: string;
    lat: number;
    lng: number;
}

interface ActiveTrip {
    driverId: string;
    driverName: string;
    vehicle: string;
    plate: string;
    rating: number;
    lat: number;
    lng: number;
}

export default function HomeScreen() {
    const [region, setRegion] = useState({
        latitude: 25.1972, // Dubai
        longitude: 55.2744,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [viewState, setViewState] = useState<'SEARCH' | 'SELECT_CATEGORY' | 'FINDING_DRIVER' | 'ON_TRIP' | 'RIDE_COMPLETE'>('SEARCH');
    const [selectedCategory, setSelectedCategory] = useState('economy');
    const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
    const { user } = useAuthStore();

    const handleConfirmRide = async () => {
        setViewState('FINDING_DRIVER');
        try {
            const ride = await rideService.createRide(
                user?.id || 'guest-001',
                'DIFC Gate Avenue',
                'Dubai Mall',
                selectedCategory
            );

            if (!ride || !ride.id) throw new Error('Failed to create ride');

            const match = await dispatchService.matchDriver(
                ride.id,
                region.latitude,
                region.longitude,
                selectedCategory
            );

            if (match && match.driver_id) {
                // Success - Start Trip Simulation
                setActiveTrip({
                    driverId: match.driver_id,
                    driverName: 'Ahmed Al-Maktoum',
                    vehicle: selectedCategory === 'luxury' ? 'Tesla Model 3' : 'Lexus ES 300h',
                    plate: 'DUBAI L 42091',
                    rating: 4.9,
                    lat: region.latitude + 0.015,
                    lng: region.longitude + 0.015,
                });
                setViewState('ON_TRIP');
            } else {
                Alert.alert('No Match', 'No drivers available at the moment.');
                setViewState('SELECT_CATEGORY');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Booking failed. Please check your connection.');
            setViewState('SELECT_CATEGORY');
        }
    };

    useEffect(() => {
        let interval: any;
        if (viewState === 'ON_TRIP' && activeTrip) {
            // Simulate driver moving towards pickup
            interval = setInterval(() => {
                setActiveTrip(prev => {
                    if (!prev) return null;
                    const latDiff = (region.latitude - prev.lat) * 0.05;
                    const lngDiff = (region.longitude - prev.lng) * 0.05;

                    // Check if driver has arrived at destination
                    if (Math.abs(region.latitude - prev.lat) < 0.0005 && Math.abs(region.longitude - prev.lng) < 0.0005) {
                        clearInterval(interval);
                        setViewState('RIDE_COMPLETE');
                        return prev; // Keep current position
                    }

                    return {
                        ...prev,
                        lat: prev.lat + latDiff,
                        lng: prev.lng + lngDiff,
                    };
                });
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [viewState, region.latitude, region.longitude, activeTrip]);

    useEffect(() => {
        // Generate mock vehicles nearby
        const mockVehicles = Array.from({ length: 15 }).map((_, i) => ({
            id: i.toString(),
            lat: region.latitude + (Math.random() - 0.5) * 0.02,
            lng: region.longitude + (Math.random() - 0.5) * 0.02,
        }));
        setVehicles(mockVehicles);
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={region}
                customMapStyle={mapStyle}
            >
                {/* Real-time Vehicle Markers (Nearby Drivers) */}
                {viewState === 'SEARCH' && vehicles.map(v => (
                    <Marker
                        key={v.id}
                        coordinate={{ latitude: v.lat, longitude: v.lng }}
                    >
                        <View style={styles.vehicleMarker}>
                            <View style={styles.vehicleCore} />
                        </View>
                    </Marker>
                ))}

                {/* Active Driver Marker (Trip Tracking) */}
                {viewState === 'ON_TRIP' && activeTrip && (
                    <Marker
                        coordinate={{ latitude: activeTrip.lat, longitude: activeTrip.lng }}
                        title="Your Driver"
                    >
                        <View style={styles.activeDriverMarker}>
                            <View style={styles.activeDriverCore} />
                        </View>
                    </Marker>
                )}

                {/* Predictive Demand Overlays (e.g., Downtown Dubai) */}
                <Circle
                    center={{ latitude: 25.1972, longitude: 55.2744 }}
                    radius={800}
                    strokeColor="rgba(239, 68, 68, 0.5)"
                    fillColor="rgba(239, 68, 68, 0.1)"
                />
            </MapView>

            <SafeAreaView style={styles.overlay}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => viewState === 'SELECT_CATEGORY' ? setViewState('SEARCH') : alert('Open Wallet Settings')}
                    >
                        <View style={styles.menuIcon} />
                    </TouchableOpacity>
                </View>

                {viewState === 'SEARCH' ? (
                    <View style={styles.bookingCard}>
                        <Text style={styles.greeting}>Where to?</Text>
                        <TouchableOpacity
                            style={styles.searchBar}
                            onPress={() => setViewState('SELECT_CATEGORY')}
                        >
                            <View style={styles.searchDot} />
                            <Text style={styles.searchPlaceholder}>DIFC Gate Avenue...</Text>
                        </TouchableOpacity>
                        <View style={styles.predictiveTag}>
                            <Text style={styles.tagText}>⚡ High demand nearby - repositioning 12 cars</Text>
                        </View>
                    </View>
                ) : viewState === 'SELECT_CATEGORY' ? (
                    <RideCategorySheet
                        selectedId={selectedCategory}
                        onSelect={setSelectedCategory}
                        onConfirm={handleConfirmRide}
                    />
                ) : viewState === 'FINDING_DRIVER' ? (
                    <FindingDriverSheet category={selectedCategory} />
                ) : viewState === 'ON_TRIP' ? (
                    <TripDetailsSheet
                        driverName={activeTrip?.driverName || ''}
                        vehicleModel={activeTrip?.vehicle || ''}
                        plateNumber={activeTrip?.plate || ''}
                        rating={activeTrip?.rating || 0}
                        eta="3 min"
                        onCancel={() => setViewState('SEARCH')}
                    />
                ) : (
                    <RideReceiptSheet
                        amount={selectedCategory === 'luxury' ? '42.00' : '24.50'}
                        driverName={activeTrip?.driverName || ''}
                        onDone={(rating) => {
                            Alert.alert('Thank you!', `You rated ${activeTrip?.driverName} ${rating} stars.`);
                            setViewState('SEARCH');
                            setActiveTrip(null);
                        }}
                    />
                )}
            </SafeAreaView>
        </View>
    );
}

const mapStyle = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#747474" }, { "lightness": "40" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#f1f5f9" }]
    }
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'box-none',
    },
    header: {
        padding: theme.spacing.md,
    },
    menuButton: {
        width: 48,
        height: 48,
        backgroundColor: 'white',
        borderRadius: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIcon: {
        width: 18,
        height: 18,
        backgroundColor: theme.colors.primary,
        borderRadius: 4,
    },
    bookingCard: {
        marginTop: 'auto',
        backgroundColor: 'white',
        padding: theme.spacing.lg,
        paddingBottom: 40,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
        fontFamily: 'Outfit-Bold'
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        gap: 12,
    },
    searchDot: {
        width: 8,
        height: 8,
        backgroundColor: theme.colors.accent,
        borderRadius: 2,
    },
    searchPlaceholder: {
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    predictiveTag: {
        marginTop: theme.spacing.md,
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.1)',
    },
    tagText: {
        fontSize: 11,
        color: theme.colors.error,
        fontWeight: '700',
    },
    vehicleMarker: {
        padding: 8,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: 20,
    },
    vehicleCore: {
        width: 8,
        height: 8,
        backgroundColor: theme.colors.accent,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'white',
    },
    activeDriverMarker: {
        padding: 10,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderRadius: 25,
    },
    activeDriverCore: {
        width: 14,
        height: 14,
        backgroundColor: theme.colors.success,
        borderRadius: 7,
        borderWidth: 3,
        borderColor: 'white',
    }
});
