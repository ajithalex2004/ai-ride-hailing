import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { theme } from '../../theme';

const { width, height } = Dimensions.get('window');

interface Request {
    id: string;
    passengerName: string;
    pickup: string;
    dropoff: string;
    fare: string;
    lat: number;
    lng: number;
}

export default function DriverHomeScreen() {
    const [isOnline, setIsOnline] = useState(false);
    const [request, setRequest] = useState<Request | null>(null);
    const [rideStatus, setRideStatus] = useState<'IDLE' | 'PICKUP' | 'ON_RIDE'>('IDLE');

    // Dubai Central
    const [region] = useState({
        latitude: 25.1972,
        longitude: 55.2744,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const toggleOnline = () => {
        setIsOnline(!isOnline);
        if (!isOnline) {
            // Simulate receiving a request after 3 seconds
            setTimeout(() => {
                setRequest({
                    id: 'REQ-101',
                    passengerName: 'Sarah J.',
                    pickup: 'DIFC Tower 1',
                    dropoff: 'Business Bay',
                    fare: 'AED 38.50',
                    lat: 25.1972 + 0.005,
                    lng: 55.2744 + 0.005,
                });
            }, 3000);
        } else {
            setRequest(null);
            setRideStatus('IDLE');
        }
    };

    const acceptRide = () => {
        setRideStatus('PICKUP');
        setRequest(null);
    };

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={region}
            >
                {isOnline && <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="You" />}
                {rideStatus === 'PICKUP' && (
                    <Marker
                        coordinate={{ latitude: region.latitude + 0.005, longitude: region.longitude + 0.005 }}
                        pinColor="blue"
                        title="Pickup Sarah J."
                    />
                )}
            </MapView>

            <SafeAreaView style={styles.overlay}>
                <View style={styles.header}>
                    <TouchableOpacity style={[styles.onlineToggle, isOnline ? styles.onlineBtn : styles.offlineBtn]} onPress={toggleOnline}>
                        <Text style={styles.onlineText}>{isOnline ? 'ONLINE' : 'GO ONLINE'}</Text>
                    </TouchableOpacity>

                    <View style={styles.earningsBox}>
                        <Text style={styles.earningsLabel}>Today's Earnings</Text>
                        <Text style={styles.earningsVal}>AED 242.50</Text>
                    </View>
                </View>

                {request && (
                    <View style={styles.requestCard}>
                        <Text style={styles.requestTitle}>New Request Incoming!</Text>
                        <View style={styles.requestDetails}>
                            <Text style={styles.passengerName}>{request.passengerName}</Text>
                            <Text style={styles.routeText}>{request.pickup} → {request.dropoff}</Text>
                            <Text style={styles.fareText}>{request.fare}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.declineBtn} onPress={() => setRequest(null)}>
                                <Text style={styles.declineText}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.acceptBtn} onPress={acceptRide}>
                                <Text style={styles.acceptText}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {rideStatus === 'PICKUP' && (
                    <View style={styles.rideProgressCard}>
                        <Text style={styles.progressStatus}>Driving to Pickup</Text>
                        <Text style={styles.progressDetail}>Sarah J. • DIFC Tower 1</Text>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => setRideStatus('ON_RIDE')}>
                            <Text style={styles.actionBtnText}>Arrived at Pickup</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {rideStatus === 'ON_RIDE' && (
                    <View style={styles.rideProgressCard}>
                        <Text style={styles.progressStatus}>On Trip to Destination</Text>
                        <Text style={styles.progressDetail}>Sarah J. • Destination: Business Bay</Text>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.success }]} onPress={() => {
                            setRideStatus('IDLE');
                            Alert.alert('Trip Complete', 'You earned AED 38.50!');
                        }}>
                            <Text style={styles.actionBtnText}>Complete Ride</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { ...StyleSheet.absoluteFillObject },
    overlay: { ...StyleSheet.absoluteFillObject, pointerEvents: 'box-none' },
    header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    onlineToggle: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 25, elevation: 5 },
    onlineBtn: { backgroundColor: theme.colors.success },
    offlineBtn: { backgroundColor: theme.colors.primary },
    onlineText: { color: 'white', fontWeight: '800', fontSize: 16 },
    earningsBox: { backgroundColor: 'white', padding: 10, borderRadius: 12, elevation: 3 },
    earningsLabel: { fontSize: 10, color: theme.colors.textMuted },
    earningsVal: { fontSize: 14, fontWeight: '800' },
    requestCard: { position: 'absolute', bottom: 40, left: 16, right: 16, backgroundColor: 'white', padding: 20, borderRadius: 20, elevation: 10 },
    requestTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12, color: theme.colors.accent },
    requestDetails: { marginBottom: 20 },
    passengerName: { fontSize: 16, fontWeight: '700' },
    routeText: { fontSize: 13, color: theme.colors.textMuted },
    fareText: { fontSize: 20, fontWeight: '800', marginTop: 5, color: theme.colors.primary },
    actions: { flexDirection: 'row', gap: 12 },
    declineBtn: { flex: 1, padding: 12, backgroundColor: theme.colors.surface, borderRadius: 12, alignItems: 'center' },
    declineText: { fontWeight: '700', color: theme.colors.textMuted },
    acceptBtn: { flex: 2, padding: 12, backgroundColor: theme.colors.primary, borderRadius: 12, alignItems: 'center' },
    acceptText: { fontWeight: '700', color: 'white' },
    rideProgressCard: { position: 'absolute', bottom: 40, left: 16, right: 16, backgroundColor: 'white', padding: 20, borderRadius: 20, elevation: 10 },
    progressStatus: { fontSize: 14, color: theme.colors.primary, fontWeight: '700' },
    progressDetail: { fontSize: 16, fontWeight: '800', marginVertical: 8 },
    actionBtn: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    actionBtnText: { color: 'white', fontWeight: '800' }
});
