import React, { useState, useCallback } from "react";
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
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { listQuotes } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function QuotesListScreen() {
  const { token } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await listQuotes(token);
      setQuotes(data.quotes || []);
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
        My Quotes
      </Text>
      <Text variant="bodyMedium" style={{ color: "#6c757d", marginBottom: 20 }}>
        {quotes.length} quote{quotes.length !== 1 ? "s" : ""}
      </Text>

      {error && (
        <Banner
          visible
          icon="alert-circle"
          style={{ marginBottom: 16, backgroundColor: "#f8d7da" }}
        >
          {error}
        </Banner>
      )}

      {quotes.length === 0 && !error && (
        <Card mode="outlined" style={{ padding: 20 }}>
          <Card.Content>
            <Text
              variant="bodyLarge"
              style={{ textAlign: "center", color: "#6c757d" }}
            >
              No quotes yet. Create one from the Send tab!
            </Text>
          </Card.Content>
        </Card>
      )}

      {quotes.map((q) => {
        const expanded = expandedId === q.id;
        return (
          <TouchableOpacity
            key={q.id}
            activeOpacity={0.7}
            onPress={() => setExpandedId(expanded ? null : q.id)}
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
                    {q.sourceAmount} {q.sourceCurrency} →{" "}
                    {q.convertedAmount?.toFixed(2)} {q.targetCurrency}
                  </Text>
                  <Chip
                    compact
                    mode="outlined"
                    textStyle={{ fontSize: 11 }}
                    style={{
                      backgroundColor:
                        q.status === "open" ? "#d1e7dd" : "#e2e3e5",
                    }}
                  >
                    {q.status?.toUpperCase()}
                  </Chip>
                </View>
                <Text
                  variant="bodySmall"
                  style={{ color: "#6c757d", marginTop: 4 }}
                >
                  Rate: {q.fxRate} — Fee: {q.fee} {q.sourceCurrency}
                </Text>
                {expanded && (
                  <View
                    style={{
                      marginTop: 12,
                      backgroundColor: "#f8f9fa",
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <Divider style={{ marginBottom: 8 }} />
                    <Row label="Quote ID" value={q.id} />
                    <Row label="Rate" value={q.fxRate?.toString()} />
                    <Row label="Fee" value={`${q.fee} ${q.sourceCurrency}`} />
                    <Row
                      label="Receive"
                      value={`${q.convertedAmount?.toFixed(2)} ${q.targetCurrency}`}
                    />
                    <Row label="Status" value={q.status?.toUpperCase()} />
                    <Row label="Delivery" value={q.estimatedDelivery} />
                    <Row
                      label="Created"
                      value={new Date(q.createdAt).toLocaleString()}
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
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
      }}
    >
      <Text variant="bodyMedium" style={{ color: "#6c757d" }}>
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
