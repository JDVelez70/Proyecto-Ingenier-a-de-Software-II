import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, Linking, Text, View } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { createResizePlugin } from 'vision-camera-resize-plugin';

const classMap: Record<number, string> = {
  0: 'Blanco bacteriano de la hoja',       // Bacterial Leaf Blight
  1: 'Mancha marrón',                       // Brown Spot
  2: 'Hoja de arroz sana',                  // Healthy Rice Leaf
  3: 'Blast de la hoja',                    // Leaf Blast
  4: 'Escaldado de la hoja',                // Leaf scald
  5: 'Mancha marrón estrecha',              // Narrow Brown Leaf Spot
  6: 'Hispa del arroz',                     // Rice Hispa
  7: 'Rizo de la vaina',                    // Sheath Blight
};

export default function ScanScreen() {
  const cameraRef = useRef<Camera>(null);
  const { model, isLoading: modelLoading, error: modelError } = useTensorflowModel(
    require('@/assets/models/plant_model.tflite')
  );
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [prediction, setPrediction] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'denied'>('checking');

  const { resize } = createResizePlugin();

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      console.log('Checking camera permission...');

      // Si ya tiene permiso, activar cámara
      if (hasPermission) {
        console.log('Permission already granted');
        setPermissionStatus('granted');
        setCameraActive(true);
        return;
      }

      // Si no tiene permiso, solicitarlo
      console.log('Requesting camera permission...');
      const permission = await requestPermission();

      console.log('Permission result:', permission);

      if (permission === 'granted') {
        setPermissionStatus('granted');
        setCameraActive(true);
      } else {
        setPermissionStatus('denied');
        setCameraActive(false);
        Alert.alert(
          'Permiso de cámara requerido',
          'Esta aplicación necesita acceso a la cámara para escanear plantas. Por favor, permite el acceso a la cámara en la configuración de tu dispositivo.',
          [
            {
              text: 'Abrir configuración',
              onPress: async () => {
                try {
                  const supported = await Linking.canOpenURL('app-settings:');
                  if (supported) {
                    await Linking.openSettings();
                  } else {
                    Alert.alert(
                      'No se puede abrir configuración',
                      'Por favor, abre manualmente los permisos desde los ajustes de tu dispositivo.'
                    );
                  }
                } catch (error) {
                  console.warn('Error al abrir configuración:', error);
                }
              },
            },
            { text: 'Cancelar', style: 'cancel' },
          ]
        );
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
      setPermissionStatus('denied');
      setCameraActive(false);
    }
  };

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    if (!model) return;

    try {
      // Redimensionar el frame
      const resized = resize(frame, {
        scale: { width: 224, height: 224 },
        pixelFormat: 'rgb',
        dataType: 'float32',
      });

      // Ejecutar el modelo
      const outputs = model.runSync([resized]);
      const output = outputs[0];
      const scores = Object.values(output);

      // Determinar la clase más probable
      const maxIndex = scores.indexOf(Math.max(...scores));
      const predictedDisease = classMap[maxIndex];

      console.log('Enfermedad más probable:', predictedDisease);
    } catch (error) {
      console.error('Error procesando frame:', error);
    }
  }, [model]);


  // Estados de carga y permisos
  if (permissionStatus === 'checking') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Verificando permisos de cámara...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Dispositivo de cámara no disponible</Text>
      </View>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Permiso de cámara denegado. Esta aplicación necesita acceso a la cámara para funcionar.
        </Text>
        <Button
          title="Solicitar Permiso Nuevamente"
          onPress={checkCameraPermission}
        />
        <Text style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: 'gray' }}>
          También puedes habilitar manualmente los permisos de cámara en Configuración → Aplicaciones → [Esta app] → Permisos
        </Text>
      </View>
    );
  }

  if (modelLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Cargando modelo...</Text>
      </View>
    );
  }

  if (modelError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error cargando modelo: {modelError.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        device={device}
        isActive={cameraActive}
        ref={cameraRef}
        frameProcessor={frameProcessor}
        pixelFormat="rgb"
      />

      <View style={{ padding: 20 }}>
        <Button
          title="Escaneo rápido"
          onPress={() => {
            // Aquí puedes agregar lógica para captura rápida
          }}
        />
        {prediction && (
          <Text style={{ marginTop: 20, textAlign: 'center' }}>
            Resultado: {prediction}
          </Text>
        )}
      </View>
    </View>
  );
}