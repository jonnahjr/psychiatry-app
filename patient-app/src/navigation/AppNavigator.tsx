import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useAuth} from '../contexts/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import PatientLoginScreen from '../screens/auth/PatientLoginScreen';
import DoctorLoginScreen from '../screens/auth/DoctorLoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import DoctorsScreen from '../screens/main/DoctorsScreen';
import AppointmentsScreen from '../screens/main/AppointmentsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Doctor Screens (using same components for now - will be customized later)
const DoctorDashboardScreen = DashboardScreen;
const PatientsScreen = DoctorsScreen;
const DoctorAppointmentsScreen = AppointmentsScreen;
const DoctorProfileScreen = ProfileScreen;

// Appointment Screens - TODO: Create these screens
// import BookAppointmentScreen from '../screens/appointments/BookAppointmentScreen';
// import AppointmentDetailsScreen from '../screens/appointments/AppointmentDetailsScreen';

// Chat & Video Screens - TODO: Create these screens
// import ChatScreen from '../screens/chat/ChatScreen';
import VideoCallScreen from '../screens/video/VideoCallScreen';

// Prescription Screens - TODO: Create these screens
// import PrescriptionsScreen from '../screens/prescriptions/PrescriptionsScreen';
// import PrescriptionDetailsScreen from '../screens/prescriptions/PrescriptionDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PatientTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = '';

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Doctors') {
            iconName = 'people';
          } else if (route.name === 'Appointments') {
            iconName = 'calendar-today';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
        },
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Doctors" component={DoctorsScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const DoctorTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = '';

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Patients') {
            iconName = 'people';
          } else if (route.name === 'Appointments') {
            iconName = 'calendar-today';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
        },
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}>
      <Tab.Screen name="Dashboard" component={DoctorDashboardScreen} />
      <Tab.Screen name="Patients" component={PatientsScreen} />
      <Tab.Screen name="Appointments" component={DoctorAppointmentsScreen} />
      <Tab.Screen name="Profile" component={DoctorProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const {user, isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#6366f1' }}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={{ marginTop: 20, fontSize: 18, color: '#ffffff', fontWeight: '600' }}>
          Loading Tele-Psychiatry...
        </Text>
      </View>
    );
  }

  const MainTabNavigator = user?.role === 'doctor' ? DoctorTabNavigator : PatientTabNavigator;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {user ? (
        // Authenticated user screens
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
            options={{headerShown: false}}
          />
          {/* TODO: Add additional screens when implemented */}
          {/* <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} options={{title: 'Book Appointment'}} /> */}
          {/* <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} options={{title: 'Appointment Details'}} /> */}
          {/* <Stack.Screen name="Chat" component={ChatScreen} options={{title: 'Chat'}} /> */}
          <Stack.Screen name="VideoCall" component={VideoCallScreen} options={{title: 'Video Call', headerShown: false}} />
          {/* <Stack.Screen name="Prescriptions" component={PrescriptionsScreen} options={{title: 'My Prescriptions'}} /> */}
          {/* <Stack.Screen name="PrescriptionDetails" component={PrescriptionDetailsScreen} options={{title: 'Prescription Details'}} /> */}
        </>
      ) : (
        // Unauthenticated user screens
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PatientLogin"
            component={PatientLoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DoctorLogin"
            component={DoctorLoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;