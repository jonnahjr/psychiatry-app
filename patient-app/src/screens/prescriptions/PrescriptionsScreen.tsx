import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PrescriptionsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Prescriptions</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e' },
});

export default PrescriptionsScreen;