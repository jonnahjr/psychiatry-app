import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppointmentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Appointments</Text>
      <Text style={styles.subtitle}>Manage your consultation schedule</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default AppointmentsScreen;