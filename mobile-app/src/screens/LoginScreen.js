import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { useAuthStore } from '../stores/authStore'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)

  async function submit() {
    setLoading(true)
    try {
      await login(email, password)
    } catch (e) {
      Alert.alert('Erreur', e.response?.data?.message || 'Identifiants incorrects.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <Text style={styles.icon}>🚴</Text>
        <Text style={styles.title}>Vélométrix</Text>
        <Text style={styles.subtitle}>Maintenance prédictive</Text>

        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}
          keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9ca3af" />
        <TextInput style={styles.input} placeholder="Mot de passe" value={password} onChangeText={setPassword}
          secureTextEntry placeholderTextColor="#9ca3af" />

        <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={submit} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Pas de compte ? <Text style={styles.linkBlue}>S'inscrire</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eff6ff' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  icon: { fontSize: 56, textAlign: 'center' },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', color: '#111827', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 12, color: '#111827' },
  btn: { backgroundColor: '#2563EB', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: 14 },
  linkBlue: { color: '#2563EB', fontWeight: '600' },
})
