```javascript
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';
import { authService } from '../../services/auth';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber) return;
    setIsLoading(true);
    try {
      const response = await authService.login(phoneNumber);
      console.log('Login Response:', response);
      // In a real flow, navigate to OTP verification screen
      alert(`OTP sent to ${ phoneNumber } `);
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to{'\n'}AI Ride Hailing</Text>
        <Text style={styles.subtitle}>Enter your mobile number to continue</Text>

        <View style={styles.inputContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.codeText}>+971</Text>
          </View>
          <TextInput 
            style={styles.input}
            placeholder="50 000 0000"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, !phoneNumber && { opacity: 0.5 }]} 
          onPress={handleLogin}
          disabled={isLoading || !phoneNumber}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>

                <Text style={styles.footerText}>
                    Powered by EXL Solutions
                </Text>
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
        fontFamily: 'Outfit-Bold',
        color: theme.colors.text,
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
        fontWeight: '700',
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
