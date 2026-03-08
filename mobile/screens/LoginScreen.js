import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Text, TextInput, Button, Banner } from "react-native-paper";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await loginUser(email.trim(), password);
      await signIn(result.accessToken, result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 80 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          variant="headlineMedium"
          style={{ fontWeight: "700", marginBottom: 4 }}
        >
          Welcome Back
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: "#6c757d", marginBottom: 32 }}
        >
          Sign in to your account
        </Text>

        <TextInput
          label="Email"
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={{ marginBottom: 16 }}
        />

        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ marginBottom: 16 }}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={{ borderRadius: 8, paddingVertical: 4 }}
        >
          Sign In
        </Button>

        {error && (
          <Banner
            visible
            icon="alert-circle"
            style={{ marginTop: 16, backgroundColor: "#f8d7da" }}
          >
            {error}
          </Banner>
        )}

        <Button
          mode="text"
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 24 }}
        >
          Don't have an account? Sign Up
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
