// AppNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import MapScreen from '../screens/MapScreen';
import ControlScreen from '../screens/ControlScreen';
import { colors } from '../styles/colors';

const Stack = createNativeStackNavigator();

// Auth Navigator (Login only)
const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.gray50 }
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// Main App Navigator (Home + Map + Control)
const MainNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20
      },
      contentStyle: { backgroundColor: colors.gray50 }
    }}
  >
    <Stack.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ 
        title: 'Robot Navigator',
        headerBackVisible: false
      }}
    />

    <Stack.Screen 
      name="Map" 
      component={MapScreen}
      options={{ title: 'Live Map' }}
    />

    <Stack.Screen 
      name="Control"
      component={ControlScreen}
      options={{ title: 'ViewBot Control Center' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return <MainNavigator />;
};

export default AppNavigator;