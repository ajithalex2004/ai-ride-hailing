import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { theme } from '../theme';

interface Props {
    category: string;
}

export default function FindingDriverSheet({ category }: Props) {
    const [pulse] = useState(new Animated.Value(1));

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.handle} />

            <View style={styles.content}>
                <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulse }] }]}>
                    <View style={styles.coreCircle}>
                        <ActivityIndicator color="white" size="large" />
                    </View>
                </Animated.View>

                <Text style={styles.title}>Dispatching AI {category}...</Text>
                <Text style={styles.subtitle}>Our AI Engine is optimizing for the best driver nearby.</Text>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>⚡ 12 drivers matched the criteria</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: theme.spacing.lg,
        paddingBottom: 60,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: theme.colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: theme.spacing.xl,
    },
    content: {
        alignItems: 'center',
    },
    pulseCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    coreCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Outfit-Bold',
        color: theme.colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    infoBox: {
        backgroundColor: theme.colors.surface,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 99,
    },
    infoText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.accent,
    }
});
