import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const typeLabel = { route: 'Route', vtt: 'VTT', ville: 'Ville', gravel: 'Gravel' }

function getWearColor(pct) {
  if (pct >= 90) return '#DC2626'
  if (pct >= 70) return '#EA580C'
  return '#16A34A'
}

export default function BikeCard({ bike, onPress }) {
  const color = getWearColor(bike.wearPercentage ?? bike.wear_percentage ?? 0)

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{bike.name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{typeLabel[bike.type]}</Text>
          </View>
        </View>
        <Text style={styles.icon}>🚴</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Kilométrage</Text>
        <Text style={styles.value}>{(bike.currentKm ?? bike.current_km ?? 0).toLocaleString()} km</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Usure</Text>
        <Text style={[styles.wear, { color }]}>{bike.wearPercentage ?? bike.wear_percentage ?? 0}%</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#111827' },
  badge: { backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, color: '#6b7280' },
  icon: { fontSize: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  label: { fontSize: 13, color: '#6b7280' },
  value: { fontSize: 13, fontWeight: '500', color: '#111827' },
  wear: { fontSize: 13, fontWeight: '700' },
})
