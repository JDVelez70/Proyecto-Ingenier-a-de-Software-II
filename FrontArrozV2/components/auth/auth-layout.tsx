import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <LinearGradient colors={['#021e0f', '#043d21', '#0b592b']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View pointerEvents="none" style={styles.blobLayer}>
          <LinearGradient
            colors={['rgba(34,197,94,0.35)', 'rgba(21,128,61,0.25)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.blob, styles.blobOne]}
          />
          <LinearGradient
            colors={['rgba(52,211,153,0.28)', 'rgba(14,165,233,0.16)']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.blob, styles.blobTwo]}
          />
          <LinearGradient
            colors={['rgba(190,242,100,0.38)', 'rgba(74,222,128,0.22)']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={[styles.blob, styles.blobThree]}
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: 'height', default: undefined })}
          keyboardVerticalOffset={Platform.select({ ios: 32, android: 0, default: 0 })}
          style={styles.avoider}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.card}>
                <LinearGradient
                  colors={['rgba(34,197,94,0.16)', 'rgba(16,185,129,0.08)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.brand}>RiceGuard</Text>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                    <View style={styles.spacer}>{children}</View>
                  </View>
                </LinearGradient>
              </View>
              {footer ? <View style={styles.footer}>{footer}</View> : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    position: 'relative',
  },
  blobLayer: {
    position: 'absolute',
    inset: 0,
  },
  blob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.8,
    transform: [{ rotate: '12deg' }],
  },
  blobOne: {
    top: -40,
    left: -60,
  },
  blobTwo: {
    bottom: -60,
    right: -40,
    transform: [{ rotate: '-18deg' }],
  },
  blobThree: {
    bottom: 120,
    left: -80,
  },
  avoider: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(190, 242, 100, 0.28)',
    backgroundColor: 'rgba(12, 61, 31, 0.16)',
    shadowColor: '#4ade80',
    shadowOpacity: 0.16,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
  },
  cardGradient: {
    flex: 1,
  },
  cardContent: {
    paddingVertical: 40,
    paddingHorizontal: 28,
    backgroundColor: 'transparent',
  },
  brand: {
    fontSize: 14,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: 'rgba(134, 239, 172, 0.9)',
    marginBottom: 8,
    fontWeight: '600',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ecfdf3',
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(209, 250, 229, 0.86)',
    lineHeight: 20,
  },
  spacer: {
    marginTop: 28,
    gap: 20,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
  },
});
