import { PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "./src/providers/AuthProvider";
import theme from "./src/theme/theme";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
