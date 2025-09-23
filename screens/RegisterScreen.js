import React, { useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Alert } from "react-native";
import AuthForm from "../components/AuthForm";
import api from "../api/api";

const background = require("../images/fondo.jpg");

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await api.post("/signup", {
        email: email,
        password: password,
      });

      const { access_token } = response.data;
      Alert.alert("Éxito", `Usuario registrado correctamente. Token recibido: ${access_token}`);
      // Si quieres guardar el token o pasar a otra pantalla, aquí puedes hacerlo
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error en register:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudo registrar, revise los datos o intente más tarde");
    }
  };

  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <AuthForm
          title="Registro"
          infoText="Crea tu cuenta ingresando correo y contraseña."
          buttonText="Registrarme"
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPasswordConfirm={true}
          onSubmit={handleRegister}
        />
        <View style={{ marginTop: 15, flexDirection: "row" }}>
          <Text>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "blue", fontWeight: "bold" }}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  background: { flex: 1, width: "100%", height: "100%" },
});