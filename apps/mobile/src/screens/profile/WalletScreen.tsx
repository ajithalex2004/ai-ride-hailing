import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../../theme';
import { paymentService } from '../../services/payment';
import { useAuthStore } from '../../store/authStore';

export default function WalletScreen({ navigation }: any) {
    const { user } = useAuthStore();
    const [balance, setBalance] = useState('0.00');
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        setIsLoading(true);
        try {
            const userId = user?.id || 'guest-001';
            const wallet = await paymentService.getWalletBalance(userId);
            setBalance(wallet.balance.toFixed(2));

            const txs = await paymentService.getTransactions(userId);
            setTransactions(txs || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTopUp = async (amount: number) => {
        try {
            await paymentService.topUpWallet(user?.id || 'guest-001', amount);
            Alert.alert('Success', `AED ${amount} added to your wallet.`);
            fetchWalletData();
        } catch (error) {
            Alert.alert('Error', 'Top up failed.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Wallet</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Current Balance</Text>
                    <Text style={styles.balanceValue}>AED {balance}</Text>
                    <View style={styles.vatTag}>
                        <Text style={styles.vatText}>Tax Compliant (5% VAT Included)</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Top Up Wallet</Text>
                <View style={styles.topUpGrid}>
                    {[50, 100, 200, 500].map((amount) => (
                        <TouchableOpacity
                            key={amount}
                            style={styles.amountButton}
                            onPress={() => handleTopUp(amount)}
                        >
                            <Text style={styles.amountText}>AED {amount}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                {isLoading ? (
                    <ActivityIndicator color={theme.colors.accent} style={{ marginTop: 20 }} />
                ) : transactions.length > 0 ? (
                    transactions.map((tx: any) => (
                        <View key={tx.id} style={styles.txRow}>
                            <View>
                                <Text style={styles.txType}>{tx.type.replace('_', ' ')}</Text>
                                <Text style={styles.txDate}>{new Date(tx.CreatedAt).toLocaleDateString()}</Text>
                            </View>
                            <Text style={[styles.txAmount, tx.type.includes('CHARGE') && { color: theme.colors.error }]}>
                                {tx.type.includes('CHARGE') ? '-' : '+'} AED {tx.amount.toFixed(2)}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No recent transactions</Text>
                )}

                <Text style={styles.branding}>Powered by EXL Solutions</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: {
        padding: 8,
    },
    backText: {
        color: theme.colors.accent,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Outfit-Bold',
        color: theme.colors.text,
    },
    content: {
        padding: theme.spacing.lg,
    },
    balanceCard: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.xl,
        alignItems: 'center',
        marginBottom: 32,
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        marginBottom: 8,
    },
    balanceValue: {
        color: 'white',
        fontSize: 32,
        fontFamily: 'Outfit-Bold',
    },
    vatTag: {
        marginTop: 16,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 99,
    },
    vatText: {
        color: theme.colors.success,
        fontSize: 10,
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Outfit-Bold',
        color: theme.colors.text,
        marginBottom: 16,
    },
    topUpGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    amountButton: {
        flex: 1,
        minWidth: '45%',
        height: 56,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.white,
    },
    amountText: {
        fontWeight: '700',
        color: theme.colors.text,
    },
    txRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    txType: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.text,
    },
    txDate: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginTop: 4,
    },
    txAmount: {
        fontWeight: '800',
        color: theme.colors.success,
    },
    emptyText: {
        textAlign: 'center',
        color: theme.colors.textMuted,
        marginTop: 20,
        fontSize: 14,
    },
    branding: {
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 20,
        color: theme.colors.textMuted,
        fontSize: 12,
    }
});
