import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { firebaseConfig } from "../firebase-config";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  //handle registration
  const handleRegister = async () => {
    // Input validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !address ||
      !phoneNumber ||
      !country ||
      !companyName
    ) {
      alert("Please fill in all the required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://res-server-sigma.vercel.app/api/user/register",
        {
          firstName,
          lastName,
          companyName,
          country,
          email,
          password,
          address,
          phoneNumber,
        }
      );

      // Assuming your API returns a message for successful registration
      if (response.status === 200) {
        console.log(response.data.message);
        Alert.alert("Account created successfully"); // Navigate to the next screen
        navigation.goBack();
        setLoading(false);
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
          } else if (response.status === 400) {
            // User already exists
            console.error(response.data.error);
            alert("User with that email already exists!");
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
  };

  const hideKeyboard = async () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <ScrollView
        className="h-full"
        showsVerticalScrollIndicator={false}
        vertical={true}
        onPress={hideKeyboard}
      >
        <KeyboardAvoidingView
          behavior="padding"
          className="flex-1 justify-center items-center"
        >
          <Image
            source={require("../assets/images/resellersplash.png")}
            className="h-32 w-32"
          />
          <Text className="text-2xl font-semibold">Sign Up</Text>
          <View className="w-full px-5 justify-center items-center">
            <TextInput
              className="h-10 w-80 border my-2 px-2 border-slate-300 border-t-0 border-l-0 border-r-0"
              placeholder="enter First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            <TextInput
              className="h-10 w-80 border my-2 px-2 border-slate-300 border-t-0 border-l-0 border-r-0"
              placeholder="enter Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
            <TextInput
              className="h-10 w-80 border my-2 px-2 border-slate-300 border-t-0 border-l-0 border-r-0"
              placeholder="enter email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              className="h-10 w-80 border my-2 px-2 border-slate-300 border-t-0 border-l-0 border-r-0"
              placeholder="enter phone number"
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
            />
            <TextInput
              className="h-10 w-80 border my-2 px-2 border-slate-300 border-t-0 border-l-0 border-r-0"
              placeholder="enter Address"
              value={address}
              onChangeText={(text) => setAddress(text)}
            />
            <TextInput
              className="h-10 w-80 border my-2 px-2 border-slate-300 border-t-0 border-l-0 border-r-0"
              placeholder="enter Country"
              value={country}
              onChangeText={(text) => setCountry(text)}
            />
            <TextInput
              className="h-10 w-80 border my-2 px-2 border-slate-300 border-t-0 border-l-0 border-r-0"
              placeholder="enter company Name"
              value={companyName}
              onChangeText={(text) => setCompanyName(text)}
            />
            <TextInput
              secureTextEntry
              className="h-10 w-80 border px-2 my-2 border-slate-300 border-t-0 border-l-0 border-r-0"
              placeholder="enter Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />

            <View className="justify-end w-full items-end mb-10 px-5">
              <Text className="text-orange-300">Forgot password</Text>
            </View>
            <TouchableOpacity
              onPress={handleRegister}
              className="bg-black h-12 my-5 w-40 justify-center items-center rounded-md"
            >
              {loading ? (
                <Text className="text-white text-xl font-normal">
                  Creating account...
                </Text>
              ) : (
                <Text className="text-white text-xl font-semibold">
                  Register
                </Text>
              )}
            </TouchableOpacity>
            <Pressable onPress={() => navigation.goBack()}>
              <Text className="text-orange-400 font-semibold">
                Already have account? Login.
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
