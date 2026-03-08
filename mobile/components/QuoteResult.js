import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function QuoteResult({ quote }) {
  return (
    <View style={styles.card}>
      <Row
        label="You send"
        value={`${quote.sourceAmount.toFixed(2)} ${quote.sourceCurrency}`}
      />
      <Row label="FX rate" value={quote.fxRate.toString()} />
      <Row
        label="Fee"
        value={`${quote.fee.toFixed(2)} ${quote.sourceCurrency}`}
      />
      <Divider />
      <Row
        label="You receive"
        value={`${quote.convertedAmount.toFixed(2)} ${quote.targetCurrency}`}
        highlight
      />
      <Row label="Est. delivery" value={quote.estimatedDelivery} />
    </View>
  );
}

function Row({ label, value, highlight }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, highlight && styles.highlight]}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  label: {
    fontSize: 15,
    color: "#6c757d",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212529",
  },
  highlight: {
    fontSize: 17,
    color: "#198754",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#dee2e6",
    marginVertical: 8,
  },
});
