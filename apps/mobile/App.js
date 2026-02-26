import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from './src/store/appStore';
import { useAuthStore } from './src/store/authStore';

import LoginScreen from './src/screens/auth/LoginScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import DriverHomeScreen from './src/screens/driver/DriverHomeScreen';
import WalletScreen from './src/screens/profile/WalletScreen';
import EarningsScreen from './src/screens/driver/EarningsScreen';

export default function App() {
  const { user } = useAuthStore();
  const { role, activeScreen, setActiveScreen, switchRole } = useAppStore();

  if (!user) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    if (role === 'passenger') {
      if (activeScreen === 'WALLET') return <WalletScreen />;
      return <HomeScreen />;
    } else {
      if (activeScreen === 'EARNINGS') return <EarningsScreen />;
      return <DriverHomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.main}>
        {renderContent()}
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setActiveScreen('HOME')} style={styles.navBtn}>
          <Text style={[styles.navText, activeScreen === 'HOME' && styles.activeText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveScreen(role === 'passenger' ? 'WALLET' : 'EARNINGS')} style={styles.navBtn}>
          <Text style={[styles.navText, (activeScreen === 'WALLET' || activeScreen === 'EARNINGS') && styles.activeText]}>
            {role === 'passenger' ? 'Wallet' : 'Earnings'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={switchRole} style={[styles.navBtn, styles.switchRoleBtn]}>
          <Text style={styles.switchRoleText}>➔ {role === 'passenger' ? 'Driver' : 'Passenger'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  main: { flex: 1 },
  navBar: {
    height: 70,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingBottom: 20,
    backgroundColor: 'white'
  },
  navBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  activeText: { color: '#3b82f6' },
  switchRoleBtn: { backgroundColor: '#1e293b' },
  switchRoleText: { color: 'white', fontSize: 11, fontWeight: '800' }
});
