import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [user, setUser] = useState("");
  const getUser = async () => {
    const email = await AsyncStorage.getItem("email");
    console.log("email logged in", email);
    setUser(email);
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text>Hello {user}</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
