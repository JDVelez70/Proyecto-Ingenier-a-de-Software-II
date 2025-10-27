import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AuthLayout } from '@/components/auth/auth-layout';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para comenzar a analizar tus cultivos de arroz con visión asistida."
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>¿No tienes cuenta?</Text>
          <Pressable onPress={() => router.push('/register')}>
            <Text style={styles.footerLink}>Regístrate</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="nombre@dominio.com"
          placeholderTextColor="rgba(187,247,208,0.55)"
          style={styles.input}
        />
      </View>
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="rgba(187,247,208,0.55)"
          secureTextEntry
          style={styles.input}
        />
      </View>
      <Pressable onPress={() => router.push('/forgot-password')} style={styles.linkButton}>
        <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
      </Pressable>
      <Pressable onPress={handleLogin} style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}>
        <LinearGradient
          colors={['#4ade80', '#16a34a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryGradient}
        >
          <Text style={styles.primaryText}>Iniciar sesión</Text>
        </LinearGradient>
      </Pressable>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  fieldBlock: {
    gap: 8,
  },
  label: {
    color: 'rgba(209,250,229,0.88)',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(236, 252, 203, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(187, 247, 208, 0.32)',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: '#ecfdf3',
    fontSize: 16,
  },
  linkButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  linkText: {
    color: 'rgba(134,239,172,0.95)',
    fontWeight: '500',
  },
  primaryButton: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#16a34a',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  primaryGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryText: {
    color: '#022c22',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.4,
  },
  primaryPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 6,
  },
  footerText: {
    color: 'rgba(226,252,239,0.65)',
  },
  footerLink: {
    color: 'rgba(163,230,53,0.9)',
    fontWeight: '600',
  },
});
