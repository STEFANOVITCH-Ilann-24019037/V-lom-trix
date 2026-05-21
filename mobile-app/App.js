import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'

import { useAuthStore } from './src/stores/authStore'
import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import DashboardScreen from './src/screens/DashboardScreen'
import BikeDetailScreen from './src/screens/BikeDetailScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import AddBikeScreen from './src/screens/AddBikeScreen'
import LoadingSpinner from './src/components/LoadingSpinner'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0 },
        headerTitleStyle: { fontWeight: '700', color: '#111827' },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { borderTopColor: '#f3f4f6' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }}
      />
    </Tab.Navigator>
  )
}

function AppNavigator() {
  const { token, isLoading } = useAuthStore()

  if (isLoading) return <LoadingSpinner />

  return (
    <Stack.Navigator screenOptions={{ headerBackTitle: 'Retour', headerTintColor: '#2563EB' }}>
      {!token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Inscription' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="BikeDetail" component={BikeDetailScreen} options={({ route }) => ({ title: route.params?.name || 'Vélo' })} />
          <Stack.Screen name="AddBike" component={AddBikeScreen} options={{ title: 'Nouveau vélo' }} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => { init() }, [init])

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <AppNavigator />
    </NavigationContainer>
  )
}
