import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from "react-native";

const icon = require("../images/logoarroz.png");
export default function AuthForm({
  title,
  infoText,
  buttonText,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPasswordConfirm = false,
  onSubmit,
}) {
  return (
    <View style={styles.modal}>
    <View style={styles.logoContainer}>
        <Image source={icon} style={styles.logo} />
    </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.info}>{infoText}</Text>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: usuario@correo.com"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {showPasswordConfirm && (
        <>
          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
    logoContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  logo: {
    width: 140,
    height: 40,
    resizeMode: "contain",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  info: { fontSize: 14, color: "#555", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
