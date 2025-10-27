import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facing] = useState<'front' | 'back'>('back');

  useEffect(() => {
    if (!permission) {
      requestPermission().catch(() => {
        /* ignore, user will see prompt */
      });
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator color="#22c55e" size="large" />
        <Text style={styles.permissionText}>Preparando cámara…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Necesitamos tu permiso</Text>
        <Text style={styles.permissionText}>
          Autoriza el acceso a la cámara para analizar las hojas y detectar señales tempranas de enfermedades.
        </Text>
        <Pressable onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Conceder acceso</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.secondaryLink}>
          <Text style={styles.secondaryLinkText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onCameraReady={() => setIsCameraReady(true)}
      />
      <LinearGradient colors={['rgba(1,22,10,0.6)', 'transparent']} style={styles.topOverlay}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backLabel}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Escaneo rápido</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>
      <View style={styles.targetFrame}>
        <View style={styles.frameOuter}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>
      </View>
      <LinearGradient colors={['transparent', 'rgba(1,22,10,0.85)']} style={styles.bottomOverlay}>
        <View style={styles.bottomContent}>
          <Text style={styles.statusTitle}>
            {isCameraReady ? 'Centra la hoja dentro del marco' : 'Inicializando la cámara…'}
          </Text>
          <Text style={styles.statusSubtitle}>
            Mantén la hoja fija y con buena iluminación para obtener mejores resultados.
          </Text>
          <Pressable style={({ pressed }) => [styles.captureButton, pressed && styles.capturePressed]}>
            <LinearGradient
              colors={['#22c55e', '#16a34a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.captureGradient}
            >
              <Text style={styles.captureLabel}>Capturar muestra</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(187,247,208,0.35)',
    backgroundColor: 'rgba(1,22,10,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLabel: {
    color: '#bbf7d0',
    fontSize: 24,
    lineHeight: 24,
  },
  headerTitle: {
    color: '#ecfccb',
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  targetFrame: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameOuter: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(34,197,94,0.35)',
    backgroundColor: 'rgba(12,83,38,0.1)',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#bbf7d0',
  },
  cornerTopLeft: {
    borderLeftWidth: 4,
    borderTopWidth: 4,
    top: -2,
    left: -2,
  },
  cornerTopRight: {
    borderRightWidth: 4,
    borderTopWidth: 4,
    top: -2,
    right: -2,
  },
  cornerBottomLeft: {
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    bottom: -2,
    left: -2,
  },
  cornerBottomRight: {
    borderRightWidth: 4,
    borderBottomWidth: 4,
    bottom: -2,
    right: -2,
  },
  bottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  bottomContent: {
    gap: 12,
  },
  statusTitle: {
    color: '#bbf7d0',
    fontSize: 18,
    fontWeight: '600',
  },
  statusSubtitle: {
    color: 'rgba(226,252,239,0.78)',
    fontSize: 14,
    lineHeight: 20,
  },
  captureButton: {
    marginTop: 12,
    borderRadius: 28,
    overflow: 'hidden',
  },
  captureGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureLabel: {
    color: '#022c22',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  capturePressed: {
    opacity: 0.85,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#01160a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  permissionTitle: {
    color: '#bbf7d0',
    fontSize: 20,
    fontWeight: '700',
  },
  permissionText: {
    color: 'rgba(226,252,239,0.78)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionButton: {
    marginTop: 12,
    borderRadius: 22,
    backgroundColor: 'rgba(34,197,94,0.6)',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  permissionButtonText: {
    color: '#022c22',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryLink: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryLinkText: {
    color: 'rgba(134,239,172,0.9)',
    fontWeight: '600',
  },
});
