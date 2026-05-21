import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import api from '../api/client'

function getWearColor(pct) {
  if (pct >= 90) return '#DC2626'
  if (pct >= 70) return '#EA580C'
  return '#16A34A'
}

export default function PartProgress({ part, onChanged }) {
  const pct = part.wearPercentage ?? part.wear_percentage ?? 0
  const remaining = part.remainingKm ?? part.remaining_km ?? 0
  const color = getWearColor(pct)

  async function changePart() {
    Alert.alert(
      'Remplacer la pièce',
      `Confirmer le remplacement de "${part.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            await api.post(`/parts/${part.id}/change`)
            onChanged?.()
          },
        },
      ]
    )
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{part.name}</Text>
        <Text style={[styles.pct, { color }]}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.bar, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.remaining}>{remaining} km restants</Text>
        {pct >= 70 && (
          <TouchableOpacity style={styles.btn} onPress={changePart}>
            <Text style={styles.btnText}>Changer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#f3f4f6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  name: { fontSize: 14, fontWeight: '600', color: '#111827' },
  pct: { fontSize: 14, fontWeight: '700' },
  track: { height: 8, backgroundColor: '#f3f4f6', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  bar: { height: 8, borderRadius: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  remaining: { fontSize: 12, color: '#6b7280' },
  btn: { backgroundColor: '#2563EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
})
