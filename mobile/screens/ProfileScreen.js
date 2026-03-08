import { useState, useCallback } from "react";
import { ScrollView } from "react-native";
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Banner,
  useTheme,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { getProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { token, user, signOut } = useAuth();
  const { colors } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setError(null);

      getProfile(token)
        .then((data) => {
          if (active) setProfile(data);
        })
        .catch((err) => {
          if (active) setError(err.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, [token]),
  );

  if (loading) {
    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text
        variant="headlineMedium"
        style={{ fontWeight: "700", marginBottom: 24 }}
      >
        Profile
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

      <Card mode="outlined" style={{ marginBottom: 24 }}>
        <Card.Content>
          <Row label="Name" value={profile?.name || user?.name || "—"} />
          <Row label="Email" value={profile?.email || user?.email || "—"} />
          <Row label="User ID" value={profile?.id || user?.id || "—"} />
          {profile?.createdAt && (
            <Row
              label="Joined"
              value={new Date(profile.createdAt).toLocaleDateString()}
            />
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        buttonColor={colors.error}
        onPress={signOut}
        style={{ borderRadius: 8, paddingVertical: 4 }}
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

function Row({ label, value }) {
  const { colors } = useTheme();
  return (
    <Card.Content
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        paddingHorizontal: 0,
      }}
    >
      <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
        {label}
      </Text>
      <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
        {value}
      </Text>
    </Card.Content>
  );
}
