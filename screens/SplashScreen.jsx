import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const SplashScreen = ({ navigation }) => {
  const [mail, setMail] = useState("");
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

  useEffect(() => {
    setTimeout(() => {
      CheckLogin();
    }, 3000);
  }, []);

  //check login status
  const CheckLogin = async () => {
    setLoading(true);
    const email = await AsyncStorage.getItem("email");
    setMail(email);
    // console.log(email);

    if(!isConnected){
      if (email != null) {
        // if (isConnected) {
          navigation.replace("Home");
          setLoading(false);
        // }
      }
    }else{
      alert("Connection lost")
    }
    //  else {
    //   navigation.navigate("Explainer");
    // }
  };
  return (
    <View className="flex-1 justify-center items-center bg-white relative">
      <View className="justify-center items-center">
        <Image
          source={require("../assets/images/resellersplash.png")}
          className="h-40 w-40"
        />
        

        {!loading && (
          <View className="justify-center items-center my-3">
            <Text className="text-slate-600 font-semibold text-xl">
              Checking Login status...
            </Text>
            <ActivityIndicator size="large" color="black" />
          </View>
        )}
      </View>

      {loading && (
        <View className="absolute bottom-10 space-y-3">
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="bg-orange-500 justify-center rounded-xl  items-center text-orange-500 h-12 w-80"
          >
            <Text className="text-white font-semibold">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            className="border border-orange-500 justify-center rounded-xl  items-center text-orange-500 h-12 w-80"
          >
            <Text className="text-orange-600 font-semibold">
              Create Account
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
        onPress={CheckLogin}
        className="bg-orange-500 justify-center rounded-2xl  items-center text-orange-500 h-12 w-80"
      >
        <Text className="text-white font-semibold">Get Started</Text>
      </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
