import React, { useState, useCallback } from 'react'
import { View, Text, ScrollView, StyleSheet, SafeAreaView, RefreshControl } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useBikeStore } from '../stores/bikeStore'
import PartProgress from '../components/PartProgress'
import LoadingSpinner from '../components/LoadingSpinner'

const typeLabel = { route: 'Route', vtt: 'VTT', ville: 'Ville', gravel: 'Gravel' }

export default function BikeDetailScreen({ route }) {
  const { id } = route.params
  const { currentBike, loading, fetchBike } = useBikeStore()
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(() => { fetchBike(id) }, [id, fetchBike])

  useFocusEffect(useCallback(() => { load() }, [load]))

  async function onRefresh() {
    setRefreshing(true)
    await fetchBike(id)
    setRefreshing(false)
  }

  if (loading && !currentBike) return <LoadingSpinner />

  const bike = currentBike

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {bike && (
          <>
            <View style={styles.header}>
              <Text style={styles.name}>{bike.name}</Text>
              <View style={styles.badges}>
                <View style={styles.badge}><Text style={styles.badgeText}>{typeLabel[bike.type]}</Text></View>
                <Text style={styles.km}>{(bike.currentKm ?? bike.current_km ?? 0).toLocaleString()} km</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Pièces</Text>
            {(bike.parts ?? []).map((part) => (
              <PartProgress key={part.id} part={part} onChanged={load} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20 },
  name: { fontSize: 24, fontWeight: '700', color: '#111827' },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  badge: { backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 12, color: '#6b7280' },
  km: { fontSize: 13, color: '#6b7280' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 10 },
})
