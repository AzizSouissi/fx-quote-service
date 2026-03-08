import { useState } from "react";
import { View } from "react-native";
import {
  PaperProvider,
  BottomNavigation,
  ActivityIndicator,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./context/AuthContext";
import theme from "./theme";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import QuoteScreen from "./screens/QuoteScreen";
import QuotesListScreen from "./screens/QuotesListScreen";
import TransfersListScreen from "./screens/TransfersListScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

const routes = [
  {
    key: "send",
    title: "Send",
    focusedIcon: "send",
    unfocusedIcon: "send-outline",
  },
  {
    key: "quotes",
    title: "Quotes",
    focusedIcon: "file-document",
    unfocusedIcon: "file-document-outline",
  },
  {
    key: "transfers",
    title: "Transfers",
    focusedIcon: "swap-horizontal-bold",
    unfocusedIcon: "swap-horizontal",
  },
  {
    key: "profile",
    title: "Profile",
    focusedIcon: "account-circle",
    unfocusedIcon: "account-circle-outline",
  },
];

const scenes = {
  send: QuoteScreen,
  quotes: QuotesListScreen,
  transfers: TransfersListScreen,
  profile: ProfileScreen,
};

function AppTabs() {
  const [index, setIndex] = useState(0);

  const renderScene = BottomNavigation.SceneMap(scenes);

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

function RootNavigator() {
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

  if (!token) {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  }

  return <AppTabs />;
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="dark" />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
