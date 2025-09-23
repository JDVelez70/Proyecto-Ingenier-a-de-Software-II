import React, { useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Alert, Platform } from "react-native";
import AuthForm from "../components/AuthForm";
import api from "../api";
import GoogleButton from "../components/GoogleLogin";
import axios from "axios";

const background = require("../images/fondo.jpg"); 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/signin", { email, password });
      const { access_token } = response.data;
      Alert.alert("Éxito", `Token recibido: ${access_token}`);
    } catch (error) {
      Alert.alert("Error", "Credenciales inválidas o servidor no disponible");
      console.error("Error en login:", error);
    }
  };

  const handleCodeReset = async () => {
      if (!email) {
        Alert.alert("Error", "NO has proporcionado un correo");
        return;
      }
  
      try {
        const response = await api.post("/password-reset/request", {
          email: email,
        });
  
        navigation.navigate("ResetPassword",{email:email});
      } catch (error) {
        console.error("Error en register:", error.response?.data || error.message);
        Alert.alert("Error", "No se pudo registrar, revise los datos o intente más tarde");
      }
    };

    async function handleGoogleLogin(){
      const response = await api.get("/login/google");
      console.log(response)
    }

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
        <TouchableOpacity onPress={handleCodeReset}>
          <Text style={{fontWeight: "bold"}}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        <GoogleButton onPress={handleGoogleLogin} />
        <View style={{ marginTop: 15, flexDirection: "row" }}>
          <Text>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{fontWeight: "bold" }}>Regístrate</Text>
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
