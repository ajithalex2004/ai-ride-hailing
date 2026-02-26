import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { theme } from '../../theme';

export default function LoginScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to{'\n'}AI Ride Hailing</Text>
                <p style={styles.subtitle}>Enter your mobile number to continue</p>

                <View style={styles.inputContainer}>
                    <View style={styles.countryCode}>
                        <Text style={styles.codeText}>+971</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="50 000 0000"
                        placeholderTextColor={theme.colors.textMuted}
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <p style={styles.footerText}>
                    Powered by EXL Solutions
                </p>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
        paddingTop: 80,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: theme.colors.text,
        lineHeight: 40,
    },
    subtitle: {
        marginTop: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.textMuted,
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    countryCode: {
        width: 60,
        height: 56,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    codeText: {
        fontWeight: '600',
        color: theme.colors.text,
    },
    input: {
        flex: 1,
        height: 56,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '600',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    button: {
        height: 56,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    footerText: {
        textAlign: 'center',
        marginTop: 'auto',
        fontSize: 12,
        color: theme.colors.textMuted,
        marginBottom: 20,
    }
});
