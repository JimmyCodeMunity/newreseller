import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }) => {
  const [mail, setMail] = useState("");

  // useEffect(() => {
  //   setTimeout(() => {
  //     CheckLogin();
  //   }, 3000);
  // }, []);

  //check login status
  const CheckLogin = async () => {
    const email = await AsyncStorage.getItem("email");
    setMail(email);

    if (email != null) {
      navigation.navigate("Home");
    } else {
      navigation.navigate("Explainer");
    }
  };
  return (
    <View className="flex-1 justify-center items-center bg-white relative">
      <View className="justify-center items-center">
        <Image
          source={require("../assets/images/resellersplash.png")}
          className="h-40 w-40"
        />
        <Text className="font-semibold text-2xl tracking-wider text-slate-600">
          Your Online MarketPlace
        </Text>
      </View>

      <TouchableOpacity
        onPress={CheckLogin}
        className="bg-orange-500 justify-center rounded-2xl absolute bottom-10 items-center text-orange-500 h-12 w-60"
      >
        <Text className="text-white font-semibold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
