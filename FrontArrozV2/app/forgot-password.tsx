import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AuthLayout } from '@/components/auth/auth-layout';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  return (
    <AuthLayout
      title="Recupera tu acceso"
      subtitle="Ingresa el correo asociado a tu cuenta. Te enviaremos un código para restablecer tu contraseña."
      footer={
        <Pressable onPress={() => router.replace('/login')}>
          <Text style={styles.footerLink}>Volver al inicio de sesión</Text>
        </Pressable>
      }
    >
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          placeholder="nombre@dominio.com"
          placeholderTextColor="rgba(187,247,208,0.55)"
          style={styles.input}
        />
      </View>
      <Text style={styles.helperText}>
        Dentro de los próximos minutos recibirás tu código de confirmación. Revisa también tu carpeta de spam.
      </Text>
      <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}>
        <LinearGradient
          colors={['#bbf7d0', '#22c55e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryGradient}
        >
          <Text style={styles.primaryText}>Enviar código</Text>
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
  helperText: {
    color: 'rgba(187,247,208,0.75)',
    fontSize: 13,
    lineHeight: 20,
  },
  primaryButton: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#16a34a',
    shadowOpacity: 0.28,
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
  footerLink: {
    color: 'rgba(163,230,53,0.9)',
    fontWeight: '600',
  },
});
