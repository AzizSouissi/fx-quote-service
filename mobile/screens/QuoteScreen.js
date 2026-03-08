import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { createQuote, createTransfer } from "../services/api";
import { useAuth } from "../context/AuthContext";
import QuoteResult from "../components/QuoteResult";

export default function QuoteScreen() {
  const { token, user, signOut } = useAuth();
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [transfer, setTransfer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);

  const handleGetQuote = async () => {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    setLoading(true);
    setError(null);
    setQuote(null);
    setTransfer(null);

    try {
      const result = await createQuote(parsed, "EUR", token);
      setQuote(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTransfer = async () => {
    if (!quote) return;

    setConfirming(true);
    setError(null);

    try {
      const result = await createTransfer(quote.id, token);
      setTransfer(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Send Money</Text>
            <Text style={styles.subtitle}>Hi, {user?.name}</Text>
          </View>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Amount (EUR)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 100"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleGetQuote}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Get Quote</Text>
          )}
        </TouchableOpacity>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {quote && !transfer && (
          <>
            <QuoteResult quote={quote} />
            <TouchableOpacity
              style={[
                styles.confirmButton,
                confirming && styles.buttonDisabled,
              ]}
              onPress={handleConfirmTransfer}
              disabled={confirming}
              activeOpacity={0.8}
            >
              {confirming ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Confirm Transfer</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {transfer && (
          <View style={styles.successBanner}>
            <Text style={styles.successTitle}>Transfer Created!</Text>
            <Text style={styles.successText}>
              Transfer ID: {transfer.id.slice(0, 8)}...
            </Text>
            <Text style={styles.successText}>
              Status: {transfer.status.toUpperCase()}
            </Text>
            <Text style={styles.successText}>
              {transfer.sourceAmount} {transfer.sourceCurrency} →{" "}
              {transfer.convertedAmount.toFixed(2)} {transfer.targetCurrency}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#6c757d",
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  logoutText: {
    color: "#dc3545",
    fontSize: 14,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    backgroundColor: "#f8f9fa",
    color: "#212529",
  },
  button: {
    backgroundColor: "#4a90d9",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#198754",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  errorBanner: {
    backgroundColor: "#f8d7da",
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#f5c2c7",
  },
  errorText: {
    color: "#842029",
    fontSize: 14,
  },
  successBanner: {
    backgroundColor: "#d1e7dd",
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#badbcc",
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f5132",
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: "#0f5132",
    marginBottom: 4,
  },
});
