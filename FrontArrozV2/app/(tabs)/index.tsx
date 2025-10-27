import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const actions = (
  onScanPress: () => void,
): Array<{
  title: string;
  subtitle: string;
  gradient: [string, string];
  onPress?: () => void;
}> => [
  {
    title: 'Escanear hoja',
    subtitle: 'Detecta hongos mediante análisis visual.',
    gradient: ['rgba(34,197,94,0.55)', 'rgba(16,185,129,0.45)'],
    onPress: onScanPress,
  },
  {
    title: 'Monitoreo de parcela',
    subtitle: 'Recorre el campo y almacena lecturas.',
    gradient: ['rgba(22,163,74,0.55)', 'rgba(2,132,199,0.45)'],
  },
  {
    title: 'Historial',
    subtitle: 'Consulta diagnósticos recientes.',
    gradient: ['rgba(101,163,13,0.55)', 'rgba(34,197,94,0.45)'],
  },
  {
    title: 'Recomendaciones',
    subtitle: 'Alertas y tratamientos personalizados.',
    gradient: ['rgba(14,165,233,0.45)', 'rgba(59,130,246,0.45)'],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const handleScan = () => {
    router.push('/scan');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={['#052e16', '#0b5a2c', '#0f7a3b']} style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroTitleBlock}>
            <Text style={styles.heroBadge}>RiceGuard</Text>
            <Text style={styles.heroTitle}>Bienvenido de nuevo</Text>
          </View>
          <View style={styles.healthPill}>
            <Text style={styles.healthPillLabel}>Índice de salud</Text>
            <Text style={styles.healthPillValue}>92%</Text>
          </View>
        </View>
        <Text style={styles.heroSubtitle}>
          Tus parcelas muestran condiciones óptimas. Realiza un escaneo rápido para confirmar el estado de las hojas.
        </Text>
        <Pressable
          onPress={handleScan}
          style={({ pressed }) => [styles.heroButton, pressed && styles.heroButtonPressed]}
        >
          <LinearGradient
            colors={['#22c55e', '#16a34a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroButtonGradient}
          >
            <Text style={styles.heroButtonText}>Iniciar escaneo rápido</Text>
          </LinearGradient>
        </Pressable>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones principales</Text>
        <View style={styles.actionsGrid}>
          {actions(handleScan).map((item) => (
            <Pressable
              key={item.title}
              onPress={item.onPress}
              style={({ pressed }) => [styles.actionPressable, pressed && styles.actionPressed]}
            >
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionCard}
              >
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen reciente</Text>
        <View style={styles.summaryWrapper}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Escaneos hoy</Text>
            <Text style={styles.summaryValue}>12</Text>
            <Text style={styles.summaryDetail}>3 requieren seguimiento</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Alertas activas</Text>
            <Text style={styles.summaryValue}>2</Text>
            <Text style={styles.summaryDetail}>Revisa el historial para más detalles.</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <LinearGradient colors={['rgba(4,47,24,0.65)', 'rgba(12,83,38,0.52)']} style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Consejo del día</Text>
          <Text style={styles.tipsContent}>
            Toma capturas bajo sombra uniforme para mejorar la detección del hongo. Mantén la cámara a 20 cm de la hoja y evita reflejos.
          </Text>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 28,
    backgroundColor: '#01160a',
  },
  hero: {
    borderRadius: 32,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(190, 242, 100, 0.28)',
    shadowColor: '#22c55e',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 18 },
    elevation: 12,
    gap: 20,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitleBlock: {
    flex: 1,
  },
  heroBadge: {
    color: 'rgba(187,247,208,0.75)',
    fontSize: 12,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#ecfccb',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 6,
  },
  heroSubtitle: {
    color: 'rgba(226,252,239,0.78)',
    fontSize: 15,
    lineHeight: 22,
  },
  healthPill: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(15,118,110,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(94,234,212,0.4)',
    flexShrink: 0,
  },
  healthPillLabel: {
    color: 'rgba(226,252,239,0.7)',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  healthPillValue: {
    color: '#99f6e4',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  heroButton: {
    borderRadius: 22,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  heroButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroButtonText: {
    color: '#022c22',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  heroButtonPressed: {
    opacity: 0.85,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    color: '#bbf7d0',
    fontSize: 18,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  actionPressable: {
    width: '48%',
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(6, 46, 22, 0.55)',
    borderWidth: 0,
  },
  actionCard: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 10,
  },
  actionPressed: {
    opacity: 0.9,
  },
  cardTitle: {
    color: '#ecfccb',
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: 'rgba(236,252,203,0.72)',
    fontSize: 13,
    lineHeight: 18,
  },
  summaryWrapper: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  summaryCard: {
    flex: 1,
    minWidth: 160,
    borderRadius: 22,
    padding: 20,
    backgroundColor: 'rgba(6, 46, 22, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.22)',
    gap: 6,
  },
  summaryLabel: {
    color: 'rgba(226,252,239,0.75)',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  summaryValue: {
    color: '#bbf7d0',
    fontSize: 28,
    fontWeight: '700',
  },
  summaryDetail: {
    color: 'rgba(226,252,239,0.7)',
    fontSize: 13,
    lineHeight: 18,
  },
  tipsCard: {
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.24)',
    gap: 10,
  },
  tipsTitle: {
    color: '#bbf7d0',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  tipsContent: {
    color: 'rgba(236,252,203,0.78)',
    fontSize: 14,
    lineHeight: 20,
  },
});
