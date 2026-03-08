import { View } from "react-native";
import { Card, Text, Divider, useTheme } from "react-native-paper";

export default function QuoteResult({ quote }) {
  const { colors } = useTheme();
  return (
    <Card style={{ marginTop: 20 }} mode="outlined">
      <Card.Content>
        <Row
          label="You send"
          value={`${quote.sourceAmount.toFixed(2)} ${quote.sourceCurrency}`}
        />
        <Row label="FX rate" value={quote.fxRate.toString()} />
        <Row
          label="Fee"
          value={`${quote.fee.toFixed(2)} ${quote.sourceCurrency}`}
        />
        <Divider style={{ marginVertical: 10 }} />
        <Row
          label="You receive"
          value={`${quote.convertedAmount.toFixed(2)} ${quote.targetCurrency}`}
          highlightColor={colors.success}
        />
        <Row label="Est. delivery" value={quote.estimatedDelivery} />
      </Card.Content>
    </Card>
  );
}

function Row({ label, value, highlightColor }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
      }}
    >
      <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
        {label}
      </Text>
      <Text
        variant="bodyMedium"
        style={{ fontWeight: "600", color: highlightColor || colors.onSurface }}
      >
        {value}
      </Text>
    </View>
  );
}
