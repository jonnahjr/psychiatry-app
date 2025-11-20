import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BookAppointmentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>
      <Text style={styles.subtitle}>Schedule a consultation</Text>
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

export default BookAppointmentScreen;