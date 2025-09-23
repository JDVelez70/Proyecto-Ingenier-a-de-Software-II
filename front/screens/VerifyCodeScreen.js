import React, { useState } from "react";
import { View, Alert, ImageBackground, StyleSheet } from "react-native";
import AuthForm from "../components/AuthForm";
import api from "../api";

const background = require("../images/fondo.jpg");

export default function VerifyCodeScreen({ navigation, route }) {
  const { email } = route.params; // viene de la pantalla anterior
  const [code, setCode] = useState("");

  const handleVerifyCode = async () => {
    try {
      await api.post("/password-reset/verify", { email, code });
      // Si es exitoso, navegar a crear nueva contraseña
      navigation.navigate("ResetPassword", { email });
    } catch (error) {
      Alert.alert("Error", "Código inválido o expirado");
      console.error(error);
    }
  };

  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <AuthForm
          title="Verifica tu correo"
          infoText="Ingresa el código que te enviamos al correo."
          buttonText="Verificar"
          email={code} // usamos `email` prop para el input
          setEmail={setCode} // usamos `setEmail` para cambiar el código
          onSubmit={handleVerifyCode}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  background: { flex: 1, width: "100%", height: "100%" },
});
