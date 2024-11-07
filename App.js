import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Navigation from "./navigation/Navigation";
import { AuthProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";

export default function App() {
  return (
    <AuthProvider>
      <SocketContextProvider>
        <Navigation />
      </SocketContextProvider>
    </AuthProvider>
  );
}
