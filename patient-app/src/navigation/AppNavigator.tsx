import React, { Suspense } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, ActivityIndicator, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useAuth} from '../contexts/AuthContext';

// Loading Screen
import LoadingScreen from '../screens/loading/LoadingScreen';

// Landing Screen
import LandingScreen from '../screens/landing/LandingScreen';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import PatientLoginScreen from '../screens/auth/PatientLoginScreenNew';
import DoctorLoginScreen from '../screens/auth/DoctorLoginScreenNew';
import RegisterScreen from '../screens/auth/RegisterScreenNew';

// Lazy load main screens for better performance
const DashboardScreen = React.lazy(() => import('../screens/main/DashboardScreen'));
const DoctorsScreen = React.lazy(() => import('../screens/main/DoctorsScreen'));
const AppointmentsScreen = React.lazy(() => import('../screens/main/AppointmentsScreen'));
const ProfileScreen = React.lazy(() => import('../screens/main/ProfileScreen'));
const SettingsScreen = React.lazy(() => import('../screens/main/SettingsScreen'));

// Doctor Screens (using same components for now - will be customized later)
const DoctorDashboardScreen = DashboardScreen;
const PatientsScreen = DoctorsScreen;
const DoctorAppointmentsScreen = AppointmentsScreen;
const DoctorProfileScreen = ProfileScreen;

// Chat & Video Screens
import ChatScreen from '../screens/chat/ChatScreen';
import VideoCallScreen from '../screens/video/VideoCallScreen';

// Prescription Screens
import PrescriptionsScreen from '../screens/prescriptions/PrescriptionsScreen';
import PrescriptionDetailsScreen from '../screens/prescriptions/PrescriptionDetailsScreen';

// Loading fallback component
const ScreenLoadingFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
    <ActivityIndicator size="large" color="#667eea" />
    <Text style={{ marginTop: 10, color: '#6b7280' }}>Loading...</Text>
  </View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PatientTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          try {
            if (route.name === 'Profile') {
              // Instagram-style profile picture for Profile tab
              return (
                <View style={{
                  width: size + 4,
                  height: size + 4,
                  borderRadius: (size + 4) / 2,
                  borderWidth: focused ? 2 : 1,
                  borderColor: focused ? '#0095f6' : '#dbdbdb',
                  padding: 1,
                }}>
                  <Image
                    source={require('../assets/D11.png')}
                    style={{
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                    }}
                  />
                </View>
              );
            }

            let iconName: string = '';

            if (route.name === 'Dashboard') {
              iconName = 'dashboard';
            } else if (route.name === 'Doctors') {
              iconName = 'people';
            } else if (route.name === 'Appointments') {
              iconName = 'calendar-today';
            }

            return <Icon name={iconName} size={size} color={color} />;
          } catch (error) {
            console.error('🚨 Tab icon error:', error);
            // Fallback to text if icon fails
            return <Text style={{color, fontSize: size * 0.6}}>{route.name[0]}</Text>;
          }
        },
        tabBarActiveTintColor: '#0095f6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#dbdbdb',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#dbdbdb',
        },
        headerTintColor: '#262626',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 16,
        },
        tabBarShowLabel: false, // Hide tab labels like Instagram
      })}>
      <Tab.Screen
        name="Dashboard"
        children={() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <DashboardScreen />
          </Suspense>
        )}
        options={{
          title: 'Dashboard',
          headerTitle: 'Patient Dashboard',
        }}
      />
      <Tab.Screen
        name="Doctors"
        children={() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <DoctorsScreen />
          </Suspense>
        )}
      />
      <Tab.Screen
        name="Appointments"
        children={() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <AppointmentsScreen />
          </Suspense>
        )}
      />
      <Tab.Screen
        name="Profile"
        children={() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <ProfileScreen />
          </Suspense>
        )}
      />
    </Tab.Navigator>
  );
};

const DoctorTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = '';

          try {
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
          } catch (error) {
            console.error('🚨 Doctor tab icon error:', error);
            // Fallback to text if icon fails
            return <Text style={{color, fontSize: size * 0.6}}>{route.name[0]}</Text>;
          }
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
      <Tab.Screen
        name="Dashboard"
        children={() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <DoctorDashboardScreen />
          </Suspense>
        )}
      />
      <Tab.Screen
        name="Patients"
        children={() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <PatientsScreen />
          </Suspense>
        )}
      />
      <Tab.Screen
        name="Appointments"
        children={() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <DoctorAppointmentsScreen />
          </Suspense>
        )}
      />
      <Tab.Screen
        name="Profile"
        children={() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <DoctorProfileScreen />
          </Suspense>
        )}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const {user, isLoading} = useAuth();

  console.log('🧭 AppNavigator render:', { user: user?.email, isLoading, role: user?.role });

  // Show loading screen only during initial auth check
  if (isLoading) {
    console.log('🧭 Showing loading screen - auth check in progress');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#667eea' }}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={{ marginTop: 20, fontSize: 18, color: '#ffffff', fontWeight: '600' }}>
          Loading...
        </Text>
      </View>
    );
  }

  // Determine which navigator to use
  const MainTabNavigator = user?.role === 'doctor' ? DoctorTabNavigator : PatientTabNavigator;
  const initialRoute = user ? 'MainTabs' : 'Loading';

  console.log('🧭 Navigation setup:', { initialRoute, hasUser: !!user, userRole: user?.role });

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {/* Always include all screens, but control access via navigation logic */}
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{headerShown: false}}
      />
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
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{title: 'Chat with Psychiatrist'}} 
      />
      <Stack.Screen 
        name="VideoCall" 
        component={VideoCallScreen} 
        options={{title: 'Video Call', headerShown: false}} 
      />
      <Stack.Screen 
        name="Prescriptions" 
        component={PrescriptionsScreen} 
        options={{title: 'My Prescriptions'}} 
      />
      <Stack.Screen
        name="PrescriptionDetails"
        component={PrescriptionDetailsScreen}
        options={{title: 'Prescription Details'}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
