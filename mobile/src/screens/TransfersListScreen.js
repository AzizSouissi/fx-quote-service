import { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Card,
  Chip,
  ActivityIndicator,
  Banner,
  Divider,
  useTheme,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { listTransfers } from "../services/api";
import { useAuth } from "../providers/AuthProvider";

export default function TransfersListScreen() {
  const { token } = useAuth();
  const { colors } = useTheme();
  const statusColors = {
    pending: colors.warningContainer,
    processing: colors.infoContainer,
    completed: colors.successContainer,
    failed: colors.errorContainer,
  };
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await listTransfers(token);
      setTransfers(data.transfers || []);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      load().finally(() => {
        if (active) setLoading(false);
      });
      return () => {
        active = false;
      };
    }, [load]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text
        variant="headlineMedium"
        style={{ fontWeight: "700", marginBottom: 4 }}
      >
        My Transfers
      </Text>
      <Text
        variant="bodyMedium"
        style={{ color: colors.onSurfaceVariant, marginBottom: 20 }}
      >
        {transfers.length} transfer{transfers.length !== 1 ? "s" : ""}
      </Text>

      {error && (
        <Banner
          visible
          icon="alert-circle"
          style={{ marginBottom: 16, backgroundColor: colors.errorContainer }}
        >
          {error}
        </Banner>
      )}

      {transfers.length === 0 && !error && (
        <Card mode="outlined" style={{ padding: 20 }}>
          <Card.Content>
            <Text
              variant="bodyLarge"
              style={{ textAlign: "center", color: colors.onSurfaceVariant }}
            >
              No transfers yet. Create a quote and confirm it!
            </Text>
          </Card.Content>
        </Card>
      )}

      {transfers.map((t) => {
        const expanded = expandedId === t.id;
        return (
          <TouchableOpacity
            key={t.id}
            activeOpacity={0.7}
            onPress={() => setExpandedId(expanded ? null : t.id)}
          >
            <Card mode="outlined" style={{ marginBottom: 12 }}>
              <Card.Content>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text variant="titleMedium" style={{ fontWeight: "600" }}>
                    {t.sourceAmount} {t.sourceCurrency} →{" "}
                    {t.convertedAmount?.toFixed(2)} {t.targetCurrency}
                  </Text>
                  <Chip
                    compact
                    mode="outlined"
                    textStyle={{ fontSize: 11 }}
                    style={{
                      backgroundColor:
                        statusColors[t.status] || colors.neutralContainer,
                    }}
                  >
                    {t.status?.toUpperCase()}
                  </Chip>
                </View>
                <Text
                  variant="bodySmall"
                  style={{ color: colors.onSurfaceVariant, marginTop: 4 }}
                >
                  Rate: {t.fxRate} — Est: {t.estimatedDelivery}
                </Text>
                {expanded && (
                  <View
                    style={{
                      marginTop: 12,
                      backgroundColor: colors.surfaceVariant,
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <Divider style={{ marginBottom: 8 }} />
                    <Row label="Transfer ID" value={t.id} />
                    <Row label="Quote ID" value={t.quoteId} />
                    <Row label="Rate" value={t.fxRate?.toString()} />
                    <Row label="Fee" value={`${t.fee} ${t.sourceCurrency}`} />
                    <Row
                      label="Receive"
                      value={`${t.convertedAmount?.toFixed(2)} ${t.targetCurrency}`}
                    />
                    <Row label="Status" value={t.status?.toUpperCase()} />
                    <Row label="Delivery" value={t.estimatedDelivery} />
                    <Row
                      label="Created"
                      value={new Date(t.createdAt).toLocaleString()}
                    />
                  </View>
                )}
              </Card.Content>
            </Card>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function Row({ label, value }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
      }}
    >
      <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
        {label}
      </Text>
      <Text
        variant="bodyMedium"
        style={{ fontWeight: "600", flexShrink: 1, textAlign: "right" }}
      >
        {value}
      </Text>
    </View>
  );
}
