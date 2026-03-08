import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../providers/AuthProvider";
import theme from "../theme/theme";
import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";

export default function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
