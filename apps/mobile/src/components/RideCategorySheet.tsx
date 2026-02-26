import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { theme } from '../theme';

export interface RideCategory {
    id: string;
    name: string;
    description: string;
    price: string;
    eta: string;
    icon: string; // Placeholder for actual icons
}

const CATEGORIES: RideCategory[] = [
    {
        id: 'economy',
        name: 'AI Economy',
        description: 'Affordable, everyday rides',
        price: 'AED 24.50',
        eta: '4 min',
        icon: '🚗',
    },
    {
        id: 'luxury',
        name: 'AI Luxury',
        description: 'Premium Lexus & Tesla fleet',
        price: 'AED 42.00',
        eta: '6 min',
        icon: '✨',
    },
    {
        id: 'xl',
        name: 'AI XL',
        description: 'Spacious SUVs for up to 6',
        price: 'AED 38.50',
        eta: '8 min',
        icon: '🚐',
    },
];

interface Props {
    selectedId: string;
    onSelect: (id: string) => void;
    onConfirm: () => void;
}

export default function RideCategorySheet({ selectedId, onSelect, onConfirm }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.handle} />

            <Text style={styles.title}>Select Ride Category</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
                {CATEGORIES.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryCard,
                            selectedId === category.id && styles.selectedCard
                        ]}
                        onPress={() => onSelect(category.id)}
                    >
                        <Text style={styles.icon}>{category.icon}</Text>
                        <View style={styles.details}>
                            <View style={styles.row}>
                                <Text style={styles.name}>{category.name}</Text>
                                <Text style={styles.price}>{category.price}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.description}>{category.description}</Text>
                                <Text style={styles.eta}>{category.eta}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                <Text style={styles.confirmText}>Confirm {CATEGORIES.find(c => c.id === selectedId)?.name}</Text>
            </TouchableOpacity>
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
        marginBottom: theme.spacing.md,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Outfit-Bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
    list: {
        maxHeight: 300,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.md,
        gap: 16,
    },
    selectedCard: {
        borderColor: theme.colors.accent,
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderWidth: 2,
    },
    icon: {
        fontSize: 32,
    },
    details: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: space - between,
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
    },
    description: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    eta: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.accent,
    },
    confirmButton: {
        backgroundColor: theme.colors.primary,
        height: 56,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
    },
    confirmText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
