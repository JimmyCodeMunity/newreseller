import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Snackbar } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkInternetConnection();
  }, []);

  const checkInternetConnection = async () => {
    const netInfoState = await NetInfo.fetch();
    setIsConnected(netInfoState.isConnected);
    setIsLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);

    if (isConnected) {
      if (email==="" || password==="") {
        alert("Please fill all the fields");
        setLoading(false)
      } else {
        try {
          const response = await axios.post(
            "https://res-server-sigma.vercel.app/api/user/login",
            {
              email,
              password,
            }
          );

          // Assuming your API returns a message for successful login
          if (response.status === 200) {
            console.log("Login successful:", response.status);
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem("password", password);
            await AsyncStorage.setItem("loginStatus", "LoggedIn");

            // console.log(response.data.message);
            setLoading(false);

            navigation.replace("Home", { email }); // Navigate to the next screen
          }
        } catch (error) {
          setLoading(false);

          // Check if the error is an Axios error and handle the status codes
          if (axios.isAxiosError(error)) {
            const { response } = error;

            if (response) {
              if (response.status === 401) {
                // Invalid password
                console.error(response.data.error);
                alert("Invalid password. Please check your credentials.");
              } else if (response.status === 404) {
                // User not found
                console.error(response.data.error);
                alert("User not found. Please create an account first.");
              } else if (response.status === 403) {
                // Account not approved
                console.error(response.data.error);
                alert("Account not approved.Please wait for approval.");
                setLoading(false);
              } else {
                // Handle other status codes
                console.error(response.data.error);
              }
            } else {
              // Handle other errors (network issues, etc.)
              console.error("An error occurred:", error.message);
            }
          }
        }
      }
    } else {
      alert("Check your connection");
      setLoading(false)
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Image
        source={require("../assets/images/resellersplash.png")}
        className="h-32 w-32"
      />
      <Text className="text-2xl font-semibold">Sign In</Text>
      <View className="w-full px-5 justify-center items-center">
        <TextInput
          className="h-10 w-80 border my-10 px-2 border-slate-400 border-t-0 border-l-0 border-r-0"
          placeholder="enter Email"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <TextInput
          secureTextEntry
          className="h-10 w-80 border px-2 mb-5 border-slate-400 border-t-0 border-l-0 border-r-0"
          placeholder="enter Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Pressable
          onPress={() => navigation.navigate("Forgot")}
          className="justify-end w-full items-end mb-10 px-5"
        >
          <Text className="text-orange-300">Forgot password</Text>
        </Pressable>
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-black h-12 my-5 w-80 justify-center items-center rounded-md"
        >
          {loading ? (
            <Text className="text-white text-xl font-semibold">
              Authenticating...
            </Text>
          ) : (
            <Text className="text-white text-xl font-semibold">Login</Text>
          )}
        </TouchableOpacity>
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text className="text-orange-400 font-semibold">Create Account.</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
