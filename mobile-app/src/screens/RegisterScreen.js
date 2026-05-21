import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native'
import { useAuthStore } from '../stores/authStore'

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const register = useAuthStore((s) => s.register)

  async function submit() {
    setLoading(true)
    try {
      await register(name, email, password, confirm)
    } catch (e) {
      const errors = e.response?.data?.errors
      const msg = errors ? Object.values(errors).flat().join('\n') : 'Erreur lors de l\'inscription.'
      Alert.alert('Erreur', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Créer un compte</Text>

        <TextInput style={styles.input} placeholder="Nom complet" value={name} onChangeText={setName} placeholderTextColor="#9ca3af" />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}
          keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9ca3af" />
        <TextInput style={styles.input} placeholder="Mot de passe (min. 8 car.)" value={password}
          onChangeText={setPassword} secureTextEntry placeholderTextColor="#9ca3af" />
        <TextInput style={styles.input} placeholder="Confirmer le mot de passe" value={confirm}
          onChangeText={setConfirm} secureTextEntry placeholderTextColor="#9ca3af" />

        <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={submit} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Création...' : 'Créer mon compte'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Déjà un compte ? <Text style={styles.linkBlue}>Se connecter</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eff6ff' },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 24 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 12, color: '#111827' },
  btn: { backgroundColor: '#2563EB', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: 14 },
  linkBlue: { color: '#2563EB', fontWeight: '600' },
})
