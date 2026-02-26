import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

const stats = [
    { label: 'Total Rides', val: '12', color: theme.colors.primary },
    { label: 'Acceptance Rate', val: '98%', color: theme.colors.success },
    { label: 'Rating', val: '4.95', color: theme.colors.accent },
];

export default function EarningsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Earnings Hub</Text>
                <Text style={styles.subtitle}>Track your performance in real-time</Text>
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={styles.balanceVal}>AED 1,420.00</Text>
                <TouchableOpacity style={styles.payoutBtn}>
                    <Text style={styles.payoutText}>Instant Payout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
                {stats.map((stat, i) => (
                    <View key={i} style={styles.statItem}>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                        <Text style={[styles.statVal, { color: stat.color }]}>{stat.val}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.historyBox}>
                <Text style={styles.sectionTitle}>Recent Invoices</Text>
                <View style={styles.historyItem}>
                    <View>
                        <Text style={styles.histTitle}>Trip REQ-992</Text>
                        <Text style={styles.histDate}>Today, 10:42 AM • Completed</Text>
                    </View>
                    <Text style={styles.histAmount}>+AED 42.50</Text>
                </View>
                <View style={styles.historyItem}>
                    <View>
                        <Text style={styles.histTitle}>Weekly Bonus</Text>
                        <Text style={styles.histDate}>Yesterday • AI Incentive</Text>
                    </View>
                    <Text style={styles.histAmount}>+AED 200.00</Text>
                </View>
            </View>

            <style jsx>{`
        /* Styles are handled via StyleSheet below, but I'll add them here for consistency in the thought process if needed */
      `}</style>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { padding: 24 },
    title: { fontSize: 24, fontWeight: '800', color: theme.colors.text },
    subtitle: { fontSize: 14, color: theme.colors.textMuted },
    balanceCard: { margin: 24, padding: 24, backgroundColor: theme.colors.primary, borderRadius: 24, alignItems: 'center' },
    balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
    balanceVal: { color: 'white', fontSize: 32, fontWeight: '800', marginVertical: 8 },
    payoutBtn: { backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 12 },
    payoutText: { color: theme.colors.primary, fontWeight: '800', fontSize: 13 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, gap: 12 },
    statItem: { flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 16, elevation: 2 },
    statLabel: { fontSize: 10, color: theme.colors.textMuted, fontWeight: '700', marginBottom: 4 },
    statVal: { fontSize: 18, fontWeight: '800' },
    historyBox: { marginTop: 32, paddingHorizontal: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
    historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12 },
    histTitle: { fontSize: 14, fontWeight: '700' },
    histDate: { fontSize: 11, color: theme.colors.textMuted },
    histAmount: { fontSize: 16, fontWeight: '800', color: theme.colors.success }
});
