import React, { useState } from "react";
import { View, Alert, ImageBackground, StyleSheet } from "react-native";
import AuthForm from "../components/AuthForm";
import api from "../api";

const background = require("../images/fondo.jpg");

export default function ResetPasswordScreen({ navigation, route }) {
  const { email } = route.params;
  const [code, setCode] = useState(""); // código que envía el backend
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!code) {
      Alert.alert("Error", "Debes ingresar el código recibido por correo");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      // Actualizamos la contraseña en el backend
      await api.post("/password-reset/confirm", {
        email,
        new_password: password, // corregido aquí
        code,
      });

      Alert.alert("Éxito", "Tu contraseña se ha actualizado correctamente");
      navigation.navigate("Login"); // volvemos al login
    } catch (error) {
      console.error("Error al actualizar contraseña:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudo actualizar la contraseña. Verifica el código o intenta más tarde.");
    }
  };

  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <AuthForm
          title="Nueva contraseña"
          infoText="Ingresa tu nueva contraseña y confírmala."
          buttonText="Actualizar"
          code={code}
          setCode={setCode} // agregamos el setter para el código
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showCodeInput={true} // suponiendo que AuthForm renderiza el input de código
          showPasswordConfirm={true}
          onSubmit={handleResetPassword}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  background: { flex: 1, width: "100%", height: "100%" },
});
