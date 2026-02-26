import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../theme';

interface Props {
    driverName: string;
    vehicleModel: string;
    plateNumber: string;
    rating: number;
    eta: string;
    onCancel: () => void;
}

export default function TripDetailsSheet({
    driverName,
    vehicleModel,
    plateNumber,
    rating,
    eta,
    onCancel
}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.handle} />

            <View style={styles.header}>
                <View>
                    <Text style={styles.etaTitle}>Driver is {eta} away</Text>
                    <Text style={styles.subtitle}>Arriving at DIFC Gate Avenue</Text>
                </View>
                <TouchableOpacity style={styles.callButton}>
                    <Text style={styles.callIcon}>📞</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.driverCard}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{driverName[0]}</Text>
                </View>
                <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>{driverName}</Text>
                    <Text style={styles.rating}>⭐ {rating.toFixed(1)} (Gold Partner)</Text>
                </View>
                <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleModel}>{vehicleModel}</Text>
                    <View style={styles.plateBox}>
                        <Text style={styles.plateText}>{plateNumber}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.safetyButton}>
                    <Text style={styles.safetyText}>🛡️ Safety Toolkit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                    <Text style={styles.cancelText}>Cancel Trip</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.branding}>Powered by EXL Solutions</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    handle: {
        width: 40,
        height: 4,
        backgroundColor: theme.colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    etaTitle: {
        fontSize: 20,
        fontFamily: 'Outfit-Bold',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textMuted,
        marginTop: 4,
    },
    callButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    callIcon: {
        fontSize: 20,
    },
    driverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginBottom: 24,
        gap: 12,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '800',
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
    },
    rating: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    vehicleInfo: {
        alignItems: 'flex-end',
    },
    vehicleModel: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    plateBox: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#000',
    },
    plateText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#000',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    safetyButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    safetyText: {
        fontWeight: '700',
        color: theme.colors.text,
    },
    cancelButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        fontWeight: '700',
        color: theme.colors.error,
    },
    branding: {
        textAlign: 'center',
        marginTop: 24,
        color: theme.colors.textMuted,
        fontSize: 10,
    }
});
