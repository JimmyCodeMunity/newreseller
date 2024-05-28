import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";
import React, { useState, useEffect } from "react";
// import { useSafeArea } from 'native-base';
import * as Icon from "react-native-feather";
import axios from "axios";
import LottieView from "lottie-react-native";
import { Appbar } from "react-native-paper";

const EditProfile = ({ navigation, route }) => {
  const { userEmail } = route.params;
  const [userdata, setUserdata] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserdata();
  }, []);

  const getUserdata = () => {
    setLoading(true);
    fetch("https://res-server-sigma.vercel.app/api/user/usersdata")
      .then((response) => response.json())
      .then((data) => {
        const user = data.find((item) => item.email === userEmail);
        if (user) {
          setUserdata(user);
          setName(user.firstName);
          setEmail(user.email);
          setAddress(user.address);
          setPhone(user.phoneNumber);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateUser = async () => {
    try {
      const response = await axios.put(
        `https://res-server-sigma.vercel.app/api/user/updateuser/${userEmail}`,
        {
          firstNmae: name,
          email: email,
          phoneNumber: phone,
          address: address,
        }
      );
      setUserdata(response.data);
      alert("User updated successfully");

      // Check if email was updated, and log out if true
      if (response.data.email !== userEmail) {
        // Navigate to the logout screen or perform logout-related action
        logout(); // Replace 'LogoutScreen' with your actual logout screen
      }
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  };
  const logout = async () => {
    // Perform any necessary logout actions (e.g., clear user session, reset state)

    // Remove user token or session data from AsyncStorage
    try {
      // Replace 'userToken' with your specific token or session key
      // Navigate to the login or authentication screen
      // Example using react-navigation:
      alert("Please Log back in with the new email.");
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <Appbar.Header style={{ backgroundColor: "white" }}>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content
          title="Edit Profile"
          titleStyle={{
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
          }}
        />
      </Appbar.Header>
      {loading ? (
        <View className="flex-1 justify-center items-center h-full w-full"></View>
      ) : (
        <ScrollView className="h-full">
          <View className="justify-center items-center py-12">
            <Image
              source={require("../assets/images/resellersplash.png")}
              className="h-32 w-32 rounded-full border border-orange-500 border-2xl"
            />
          </View>
          <View className="justify-center items-center">
            <Text className="text-slate-500 text-3xl font-semibold">
              {name}'s Profile
            </Text>
          </View>

          <View className="justify-center my-3 items-start px-5">
            <View className="my-5 justify-center items-start w-full">
              <Text className="text-lg font-semibold text-slate-600">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                className="border border-slate-200 rounded-2xl h-10 w-full px-4"
              />
            </View>
            <View className="my-5 justify-center items-start w-full">
              <Text className="text-lg font-semibold text-slate-600">
                UserName
              </Text>
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                className="border border-slate-200 rounded-2xl h-10 w-full px-4"
              />
            </View>
            <View className="my-5 justify-center items-start w-full">
              <Text className="text-lg font-semibold text-slate-600">
                Address
              </Text>
              <TextInput
                value={address}
                onChangeText={(text) => setAddress(text)}
                className="border border-slate-200 rounded-2xl h-10 w-full px-4"
              />
            </View>
            <View className="my-5 justify-center items-start w-full">
              <Text className="text-lg font-semibold text-slate-600">
                Current Phone: {phone}
              </Text>
              <TextInput
                value={phone}
                onChangeText={(text) => setPhone(text)}
                placeholder="enter new phone"
                className="border border-slate-200 rounded-2xl h-10 w-full px-4"
              />
            </View>
            <View className="my-5 justify-center items-center w-full">
              <TouchableOpacity
                onPress={updateUser}
                className="bg-orange-500 h-10 w-80 rounded-xl justify-center items-center"
              >
                <Text className="text-white font-semibold text-lg">
                  {" "}
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});
