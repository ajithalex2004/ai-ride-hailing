import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { theme } from '../../theme';

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            {/* Fake Map Background */}
            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>Map Integrated (Predictive Heatmap Ready)</Text>
            </View>

            {/* Header Profile Icon */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.menuButton}>
                    <View style={styles.circle} />
                </TouchableOpacity>
            </View>

            {/* Booking Card */}
            <View style={styles.bookingCard}>
                <Text style={styles.greeting}>Where to?</Text>

                <TouchableOpacity style={styles.searchBar}>
                    <View style={styles.dot} />
                    <Text style={styles.searchPlaceholder}>Dubai Mall, Downtown...</Text>
                </TouchableOpacity>

                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>Office</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    mapPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapText: {
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    header: {
        padding: theme.spacing.md,
    },
    menuButton: {
        width: 44,
        height: 44,
        backgroundColor: 'white',
        borderRadius: 22,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: 20,
        height: 20,
        backgroundColor: theme.colors.primary,
        borderRadius: 4,
    },
    bookingCard: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        paddingBottom: 40,
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
    },
    searchBar: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dot: {
        width: 10,
        height: 10,
        backgroundColor: theme.colors.accent,
        borderRadius: 2,
    },
    searchPlaceholder: {
        color: theme.colors.textMuted,
        fontWeight: '500',
    },
    quickActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: theme.spacing.md,
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.textMuted,
    }
});
