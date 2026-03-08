import { useState } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Banner,
  Card,
  Chip,
  useTheme,
} from "react-native-paper";
import { createQuote, createTransfer } from "../services/api";
import { useAuth } from "../providers/AuthProvider";
import QuoteResult from "../components/QuoteResult";

export default function QuoteScreen() {
  const { token, user } = useAuth();
  const { colors } = useTheme();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
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
      const result = await createQuote(parsed, currency, token);
      setQuote(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTransfer = async () => {
    if (!quote?.id) return;

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
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          variant="headlineMedium"
          style={{ fontWeight: "700", marginBottom: 4 }}
        >
          Send Money
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: colors.onSurfaceVariant, marginBottom: 24 }}
        >
          Hi, {user?.name}
        </Text>

        <TextInput
          label={`Amount (${currency})`}
          mode="outlined"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          style={{ marginBottom: 12 }}
        />

        <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
          {["EUR", "USD", "GBP"].map((c) => (
            <Chip
              key={c}
              selected={currency === c}
              onPress={() => setCurrency(c)}
              mode="outlined"
            >
              {c}
            </Chip>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleGetQuote}
          loading={loading}
          disabled={loading}
          style={{ borderRadius: 8, paddingVertical: 4 }}
        >
          Get Quote
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

        {quote && !transfer && (
          <>
            <QuoteResult quote={quote} />
            <Button
              mode="contained"
              onPress={handleConfirmTransfer}
              loading={confirming}
              disabled={confirming}
              buttonColor={colors.success}
              style={{ borderRadius: 8, paddingVertical: 4, marginTop: 16 }}
            >
              Confirm Transfer
            </Button>
          </>
        )}

        {transfer && (
          <Card
            style={{ marginTop: 20, backgroundColor: colors.successContainer }}
            mode="outlined"
          >
            <Card.Content>
              <Text
                variant="titleMedium"
                style={{
                  color: colors.onSuccessContainer,
                  fontWeight: "700",
                  marginBottom: 8,
                }}
              >
                Transfer Created!
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSuccessContainer }}
              >
                ID: {transfer.id.slice(0, 8)}...
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSuccessContainer }}
              >
                Status: {transfer.status.toUpperCase()}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSuccessContainer }}
              >
                {transfer.sourceAmount} {transfer.sourceCurrency} →{" "}
                {transfer.convertedAmount.toFixed(2)} {transfer.targetCurrency}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
