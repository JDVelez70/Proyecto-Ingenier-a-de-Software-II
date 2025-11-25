import { savePhotoState } from '@/client';
import { LabelCamera } from '@/components/LabelCamera';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, Linking, StyleSheet, Text, View } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useSharedValue } from 'react-native-reanimated';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { createResizePlugin } from 'vision-camera-resize-plugin';

const classMap: Record<number, string> = {
  0: 'Blanco bacteriano de la hoja',
  1: 'Mancha marrón',
  2: 'Hoja de arroz sana',
  3: 'Blast de la hoja',
  4: 'Escaldado de la hoja',
  5: 'Mancha marrón estrecha',
  6: 'Hispa del arroz',
  7: 'Rizo de la vaina',
};



export default function ScanScreen() {
  const cameraRef = useRef<Camera>(null);
  const { model, isLoading: modelLoading, error: modelError } = useTensorflowModel(
    require('@/assets/models/plant_model.tflite')
  );
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('checking');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedPrediction, setCapturedPrediction] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const currentLabel = useSharedValue('');
  const lastPredictionRef = useRef<string>('');

  const { resize } = createResizePlugin();

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      console.log('Checking camera permission...');

      if (hasPermission) {
        console.log('Permission already granted');
        setPermissionStatus('granted');
        setCameraActive(true);
        return;
      }

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

  const updatePrediction = Worklets.createRunOnJS((pred: string) => {
    try {
      currentLabel.value = pred;
      lastPredictionRef.current = pred; // Guardar la última predicción
    } catch (e) {
      console.error('updatePrediction error:', e);
    }
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    if (!model) return;

    try {
      const resized = resize(frame, {
        scale: { width: 224, height: 224 },
        pixelFormat: 'rgb',
        dataType: 'float32',
      });
      const outputs = model.runSync([resized]);
      const output = outputs[0];
      const scores = Object.values(output) as number[];
      const maxScore = Math.max(...scores);
      if (maxScore < 0.5) return;
      console.log('max score:', maxScore);
      const maxIndex = scores.indexOf(maxScore);
      const predictedDisease = classMap[maxIndex];
      updatePrediction(predictedDisease);
    } catch (error) {
      console.error('Frame processor error:', error);
    }
  }, [model]);

 const capturePhotoAndPrediction = async () => {
  if (!cameraRef.current) {
    Alert.alert('Error', 'Camera not available');
    return;
  }

  try {
    setIsCapturing(true);

    // Captura
    const photo = await cameraRef.current.takePhoto({
      flash: "off",
    });

    const prediction = lastPredictionRef.current || "unknown";

    console.log("Foto capturada:", photo.path);
    console.log("Predicción:", prediction);

    // Guarda en backend
    await savePhotoState(photo.path, prediction === "healthy" ? "sana" : "enferma", prediction);

    setCapturedPhoto(photo.path);
    setCapturedPrediction(prediction);

    Alert.alert(
      "Done",
      `Disease detected: ${prediction}\n\nPhoto uploaded successfully.`,
      [{ text: "OK" }]
    );

  } catch (error) {
    console.error("Error capturing photo:", error);
    Alert.alert("Error", "Photo capture failed");
  } finally {
    setIsCapturing(false);
  }
};

  const clearCapture = () => {
    setCapturedPhoto(null);
    setCapturedPrediction(null);
  };

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
        photo={true}
      />
      <LabelCamera text={currentLabel} />
      
      <View style={styles.controlsContainer}>
        <Button
          title={isCapturing ? "Capturando..." : "Capturar Foto y Predicción"}
          onPress={capturePhotoAndPrediction}
          disabled={isCapturing}
          color="#007AFF"
        />
        
        {capturedPhoto && (
          <View style={styles.captureResult}>
            <Text style={styles.resultTitle}>Última Captura:</Text>
            <Text style={styles.predictionText}>
              Predicción: {capturedPrediction || 'No disponible'}
            </Text>
            <Image 
              source={{ uri: `file://${capturedPhoto}` }} 
              style={styles.capturedImage}
              resizeMode="cover"
            />
            <Button
              title="Limpiar Captura"
              onPress={clearCapture}
              color="#FF3B30"
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  captureResult: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  predictionText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
});