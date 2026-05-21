import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native'
import { useBikeStore } from '../stores/bikeStore'

const TYPES = [
  { value: 'route', label: 'Route' },
  { value: 'vtt', label: 'VTT' },
  { value: 'ville', label: 'Ville' },
  { value: 'gravel', label: 'Gravel' },
]

export default function AddBikeScreen({ navigation }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('route')
  const [initialKm, setInitialKm] = useState('0')
  const [loading, setLoading] = useState(false)
  const createBike = useBikeStore((s) => s.createBike)

  async function submit() {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un nom.')
      return
    }
    setLoading(true)
    try {
      await createBike({ name, type, initial_km: parseInt(initialKm) || 0 })
      navigation.goBack()
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de créer le vélo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Nouveau vélo</Text>

        <Text style={styles.label}>Nom</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Mon vélo" placeholderTextColor="#9ca3af" />

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeGrid}>
          {TYPES.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[styles.typeBtn, type === t.value && styles.typeBtnActive]}
              onPress={() => setType(t.value)}
            >
              <Text style={[styles.typeBtnText, type === t.value && styles.typeBtnTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Kilométrage initial (km)</Text>
        <TextInput style={styles.input} value={initialKm} onChangeText={setInitialKm}
          keyboardType="numeric" placeholderTextColor="#9ca3af" />

        <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={submit} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Création...' : 'Créer le vélo'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, fontSize: 15, color: '#111827' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff' },
  typeBtnActive: { borderColor: '#2563EB', backgroundColor: '#eff6ff' },
  typeBtnText: { fontSize: 14, color: '#374151' },
  typeBtnTextActive: { color: '#2563EB', fontWeight: '600' },
  btn: { backgroundColor: '#2563EB', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 24 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
