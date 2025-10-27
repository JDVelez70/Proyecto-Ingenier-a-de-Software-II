import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AuthLayout } from '@/components/auth/auth-layout';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    router.replace('/(tabs)');
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Regístrate para comenzar a detectar enfermedades en tus parcelas usando tu cámara."
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
          <Pressable onPress={() => router.replace('/login')}>
            <Text style={styles.footerLink}>Inicia sesión</Text>
          </Pressable>
        </View>
      }
    >
      <Pressable style={({ pressed }) => [styles.googleButton, pressed && styles.googlePressed]}>
        <FontAwesome name="google" size={20} color="#0f172a" />
        <Text style={styles.googleText}>Continuar con Google</Text>
      </Pressable>
      <View style={styles.dividerRow}>
        <View style={styles.rule} />
        <Text style={styles.dividerText}>o completa tus datos</Text>
        <View style={styles.rule} />
      </View>
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Carolina Ríos"
          placeholderTextColor="rgba(187,247,208,0.55)"
          style={styles.input}
        />
      </View>
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
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          placeholderTextColor="rgba(187,247,208,0.55)"
          secureTextEntry
          style={styles.input}
        />
      </View>
      <Pressable onPress={handleRegister} style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}>
        <LinearGradient
          colors={['#4ade80', '#22c55e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryGradient}
        >
          <Text style={styles.primaryText}>Crear cuenta</Text>
        </LinearGradient>
      </Pressable>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(236, 252, 203, 0.9)',
    borderRadius: 999,
    gap: 10,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.4)',
  },
  googlePressed: {
    opacity: 0.85,
  },
  googleText: {
    color: '#14532d',
    fontWeight: '600',
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(101,163,13,0.3)',
  },
  dividerText: {
    color: 'rgba(190,242,100,0.78)',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
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
});
