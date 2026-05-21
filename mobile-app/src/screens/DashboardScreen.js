import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet, SafeAreaView } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useBikeStore } from '../stores/bikeStore'
import BikeCard from '../components/BikeCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function DashboardScreen({ navigation }) {
  const { bikes, loading, fetchDashboard } = useBikeStore()
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState(null)
  const [lastActivity, setLastActivity] = useState(null)

  const load = useCallback(async () => {
    const data = await fetchDashboard()
    setStats(data.stats)
    setLastActivity(data.lastActivity ?? data.last_activity)
  }, [fetchDashboard])

  useFocusEffect(useCallback(() => { load() }, [load]))

  async function onRefresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  if (loading && !bikes.length) return <LoadingSpinner />

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bikes}
        keyExtractor={(b) => String(b.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>🚴 Dashboard</Text>
            {stats && (
              <Text style={styles.subtitle}>
                {stats.nbBikes ?? stats.nb_bikes} vélo(s) · {(stats.totalKm ?? stats.total_km ?? 0).toLocaleString()} km
              </Text>
            )}
            {lastActivity && (
              <View style={styles.activity}>
                <Text style={styles.activityTitle}>Dernière activité Strava</Text>
                <Text style={styles.activityName}>{lastActivity.name}</Text>
                <Text style={styles.activityKm}>{lastActivity.distanceKm ?? lastActivity.distance_km} km</Text>
              </View>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <BikeCard bike={item} onPress={() => navigation.navigate('BikeDetail', { id: item.id, name: item.name })} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun vélo. Ajoutez-en un !</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddBike')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  list: { padding: 16, paddingBottom: 80 },
  header: { marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  activity: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  activityTitle: { fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 },
  activityName: { fontSize: 14, fontWeight: '600', color: '#111827', marginTop: 2 },
  activityKm: { fontSize: 20, fontWeight: '700', color: '#2563EB', marginTop: 2 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#9ca3af', fontSize: 15 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', shadowColor: '#2563EB', shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32, fontWeight: '300' },
})
