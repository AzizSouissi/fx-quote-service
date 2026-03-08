import React from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import QuoteScreen from "./screens/QuoteScreen";
import QuotesListScreen from "./screens/QuotesListScreen";
import TransfersListScreen from "./screens/TransfersListScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function TabLabel({ label, focused }) {
  return (
    <View style={{ alignItems: "center", paddingTop: 8 }}>
      <View
        style={{
          width: 24,
          height: 3,
          borderRadius: 2,
          backgroundColor: focused ? "#4a90d9" : "transparent",
          marginBottom: 6,
        }}
      />
      <Text
        style={{
          fontSize: 13,
          fontWeight: focused ? "700" : "500",
          color: focused ? "#4a90d9" : "#6c757d",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 64,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e9ecef",
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="Send"
        component={QuoteScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabLabel label="Send" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Quotes"
        component={QuotesListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabLabel label="Quotes" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Transfers"
        component={TransfersListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabLabel label="Transfers" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabLabel label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
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
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#4a90d9" />
      </View>
    );
  }

  return token ? <AppTabs /> : <AuthStack />;
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
