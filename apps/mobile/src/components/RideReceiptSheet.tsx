import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { theme } from '../theme';

interface Props {
    amount: string;
    driverName: string;
    onDone: (rating: number) => void;
}

export default function RideReceiptSheet({ amount, driverName, onDone }: Props) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.handle} />

            <View style={styles.header}>
                <Text style={styles.title}>Ride Complete</Text>
                <Text style={styles.subtitle}>Hope you enjoyed your trip with {driverName}</Text>
            </View>

            <View style={styles.receiptBox}>
                <Text style={styles.amountLabel}>Total Charged</Text>
                <Text style={styles.amountValue}>AED {amount}</Text>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Text style={styles.detailLabel}>Base Fare</Text>
                    <Text style={styles.detailValue}>AED {(parseFloat(amount) * 0.95).toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.detailLabel}>VAT (5%)</Text>
                    <Text style={styles.detailValue}>AED {(parseFloat(amount) * 0.05).toFixed(2)}</Text>
                </View>
            </View>

            <Text style={styles.ratingTitle}>Rate your experience</Text>
            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                    <TouchableOpacity key={s} onPress={() => setRating(s)}>
                        <Text style={[styles.star, rating >= s ? styles.starActive : styles.starInactive]}>
                            ⭐
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                style={styles.commentInput}
                placeholder="Add a comment (optional)..."
                placeholderTextColor={theme.colors.textMuted}
                value={comment}
                onChangeText={setComment}
                multiline
            />

            <TouchableOpacity
                style={[styles.doneButton, rating === 0 && { opacity: 0.5 }]}
                onPress={() => onDone(rating)}
                disabled={rating === 0}
            >
                <Text style={styles.doneText}>Submit & Done</Text>
            </TouchableOpacity>

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
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Outfit-Bold',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textMuted,
        marginTop: 4,
        textAlign: 'center',
    },
    receiptBox: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        marginBottom: 24,
    },
    amountLabel: {
        textAlign: 'center',
        fontSize: 14,
        color: theme.colors.textMuted,
        marginBottom: 4,
    },
    amountValue: {
        textAlign: 'center',
        fontSize: 32,
        fontFamily: 'Outfit-Bold',
        color: theme.colors.text,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: theme.colors.textMuted,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    ratingTitle: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Outfit-Bold',
        color: theme.colors.text,
        marginBottom: 16,
    },
    starsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24,
    },
    star: {
        fontSize: 32,
    },
    starActive: {
        opacity: 1,
    },
    starInactive: {
        opacity: 0.2,
    },
    commentInput: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        height: 80,
        textAlignVertical: 'top',
        color: theme.colors.text,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    doneButton: {
        backgroundColor: theme.colors.primary,
        height: 56,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    branding: {
        textAlign: 'center',
        marginTop: 24,
        color: theme.colors.textMuted,
        fontSize: 10,
    }
});
