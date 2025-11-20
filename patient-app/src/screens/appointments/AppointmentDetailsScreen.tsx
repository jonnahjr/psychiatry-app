import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppointmentDetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointment Details</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e' },
});

export default AppointmentDetailsScreen;