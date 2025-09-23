import React, { useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Alert } from "react-native";
import AuthForm from "../components/AuthForm";
import api from "../api/api";

const background = require("../images/fondo.jpg"); 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/signin", {
        email: email,
        password: password,
      });

      const { access_token, token_type } = response.data;

      Alert.alert("Éxito", `Token recibido: ${access_token}`);

    } catch (error) {
      Alert.alert("Error", "Credenciales inválidas o servidor no disponible");
      console.error("Error en login:", error);
    }
  };

  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <AuthForm
          title="Iniciar sesión"
          infoText="Accede ingresando tu correo y contraseña."
          buttonText="Entrar"
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleLogin}
        />
        <View style={{ marginTop: 15, flexDirection: "row" }}>
          <Text>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "blue", fontWeight: "bold" }}>Regístrate</Text>
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
