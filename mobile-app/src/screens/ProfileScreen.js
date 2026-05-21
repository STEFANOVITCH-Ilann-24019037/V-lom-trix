import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native'
import { useAuthStore } from '../stores/authStore'

export default function ProfileScreen() {
  const { user, logout } = useAuthStore()

  function confirmLogout() {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnecter', style: 'destructive', onPress: logout },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.divider} />
          <Text style={styles.strava}>
            Strava :{' '}
            {user?.stravaConnected ?? user?.strava_connected
              ? <Text style={{ color: '#16A34A' }}>Connecté</Text>
              : <Text style={{ color: '#9ca3af' }}>Non connecté</Text>
            }
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '600', color: '#111827' },
  email: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  divider: { width: '100%', height: 1, backgroundColor: '#f3f4f6', marginVertical: 14 },
  strava: { fontSize: 14, color: '#374151' },
  logoutBtn: { borderWidth: 1, borderColor: '#fca5a5', borderRadius: 12, padding: 14, alignItems: 'center' },
  logoutText: { color: '#DC2626', fontWeight: '600', fontSize: 15 },
})
