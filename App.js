import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Navigation from "./navigation/Navigation";
import { AuthProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";
import { AlertNotificationRoot } from "react-native-alert-notification";

export default function App() {
  return (
    <AuthProvider>
      <SocketContextProvider>
      <AlertNotificationRoot>
        <Navigation />
        </AlertNotificationRoot>
      </SocketContextProvider>
    </AuthProvider>
  );
}
