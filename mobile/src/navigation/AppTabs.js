import { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import QuoteScreen from "../screens/QuoteScreen";
import QuotesListScreen from "../screens/QuotesListScreen";
import TransfersListScreen from "../screens/TransfersListScreen";
import ProfileScreen from "../screens/ProfileScreen";

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

const renderScene = BottomNavigation.SceneMap({
  send: QuoteScreen,
  quotes: QuotesListScreen,
  transfers: TransfersListScreen,
  profile: ProfileScreen,
});

export default function AppTabs() {
  const [index, setIndex] = useState(0);

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
