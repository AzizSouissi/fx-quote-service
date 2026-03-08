import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Text, TextInput, Button, Banner, useTheme } from "react-native-paper";
import { registerUser, loginUser } from "../services/api";
import { useAuth } from "../providers/AuthProvider";

export default function RegisterScreen({ navigation }) {
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await registerUser(email.trim(), password, name.trim());
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
      style={{ flex: 1, backgroundColor: colors.background }}
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
          Create Account
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: colors.onSurfaceVariant, marginBottom: 32 }}
        >
          Sign up to start sending money
        </Text>

        <TextInput
          label="Full Name"
          mode="outlined"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
          style={{ marginBottom: 16 }}
        />

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
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          buttonColor={colors.success}
          style={{ borderRadius: 8, paddingVertical: 4 }}
        >
          Sign Up
        </Button>

        {error && (
          <Banner
            visible
            icon="alert-circle"
            style={{ marginTop: 16, backgroundColor: colors.errorContainer }}
          >
            {error}
          </Banner>
        )}

        <Button
          mode="text"
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 24 }}
        >
          Already have an account? Sign In
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
