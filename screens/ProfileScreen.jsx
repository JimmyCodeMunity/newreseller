import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ProfileScreen = () => {
  const [useremail, setUseremail] = useState("");
  const [loggeduser, setLoggeduser] = useState([]);
  const [loading, setLoading] = useState(false);

  //cont get useremail
  const getUseremail = async () => {
    try {
      const email = await AsyncStorage.getItem("email");
      setUseremail(email);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUseremail();
  }, []);

  //collect user data
  const getUserdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://res-server-sigma.vercel.app/api/user/usersdata/${useremail}`
      );
      const userdata = response.data[0];
      setLoggeduser(userdata);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserdata();
  }, []);
  return (
    <SafeAreaView className="flex-1">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-2xl font-semibold text-xl">
            Loading user info....
          </Text>
        </View>
      ) : (
        <View className="bg-white items-center">
          <Text>{loggeduser.firstName} Profile</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
