// GeneralSettings.js
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity,Linking, Dimensions, SafeAreaView, Share, Switch, ScrollView, RefreshControl } from 'react-native';
import AntIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { getUserdata } from '../api';
import Modal from "react-native-modal";
const windowHeight = Dimensions.get("window").height;
import LottieView from "lottie-react-native";
import { useCurrency } from '../components/CurrrencyProvider';
import { CommonActions, StackActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';



const SettingScreen = ({ navigation, route }) => {
  const [email,setEmail] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  // console.log(email);
  //const [isDollar,setIsDollar] = useState(true);
  const { isDollar, setIsDollar } = useCurrency();
  const {userdata,logout} = useContext(AuthContext)
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState("");
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLogoutConfirm, setLogoutConfirm] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");

  



  // //fetch userdata
  // const getUserdata = () => {
  //   fetch("https://opasso-app-backend.vercel.app/api/user/usersdata")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setLoading(false);
  //       const seller = data.find((item) => item.email === email);
  //       if (seller) {
  //         setUserdata(seller);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }


  const [loggedUser,setLoggedUser] = useState('');

  const getUserInfo = async () => {
    setLoading(true);
    // console.log("myemail",email)
    try {
      
      const response = await axios.get(
        `https://res-server-sigma.vercel.app/api/user/usersdata/${email}`
      );
      const gotuser = response.data[0];
      // console.log("user is",gotuser)
      // setLoggedUser(gotuser.firstName + " " + gotuser.lastName);
      const firstName = gotuser.companyName;
      // console.log(firstName)
      // const user = await AsyncStorage.setItem("loggedUser", firstName);
      setLoggedUser(firstName)
      // console.log("user",user)

      // console.log(gotuser.firstName)
      setLoading(false);
      //   console.log(gotuser.firstName);
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert("Error getting user information..");
    }
  };
  

  


  


  
  








  // Function to open a URL in the web browser
  const openWebsite = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open URI: ${url}`);
      }
    });
  };

  


  const onRefresh = async () => {
    setIsRefreshing(true);
    setLoading(true);
    try {
      
      
      // await getUserdata();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    setIsRefreshing(false);
  };

  const handleShare = () => {
    const message = "Share this Awesome App!!";
    const url = "https://www.resellersprint.com";

    Share.share({
      message: message,
      url: url,
    })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };

  const handleStory = () =>{
    navigation.navigate('story')
  }
  const handlePolicy = () =>{
    navigation.navigate('policy')
  }
  const handleFaq = () =>{
    navigation.navigate('faq')
  }

  const handleWhatsapp = () => {
    const phoneNumber = 713144386;
    const countryCode = "+254";
    if (phoneNumber) {
      const fullPhoneNumber = `${countryCode}${713144386}`;
      const whatsappURL = `https://wa.me/${fullPhoneNumber}`;

      Linking.canOpenURL(whatsappURL)
        .then((supported) => {
          if (!supported) {
            console.error("WhatsApp is not installed on this device");
          } else {
            return Linking.openURL(whatsappURL);
          }
        })
        .catch((error) =>
          console.error(`Error opening WhatsApp chat: ${error}`)
        );
    } else {
      console.error("Phone number is not available");
    }
  };
  const settingsOptions = [
    { title: 'Visit website', onPress: () => openWebsite("https://www.resellersprint.com"), icon: 'globe' },
    { title: 'Become a supplier', onPress: () => openWebsite("https://resellersprint.com/supplier-register"), icon: 'user' },
    // { title: 'Rate Us on google', onPress: () => console.log('Cellular pressed'), icon: 'star' },
    { title: 'Share app', onPress: handleShare, icon: 'share' },
    { title: 'Privacy Policy', onPress: handlePolicy, icon: 'share' },
    { title: 'FAQ', onPress: handleFaq, icon: 'share' },
    { title: 'Our Story', onPress: handleStory, icon: 'share' },
    { title: 'Chat with Admin', onPress: handleWhatsapp, icon: 'message' },

    // Add more settings options as needed
  ];
  //logout function start
  const handleLogout = async () => {
    await logout();
    

  };

  

  





  return (
    <SafeAreaView className="flex-1 bg-white">
      {loading ? (
        <View className="flex-1 justify-center items-center h-full w-full">
          

              <Text className="text-slate-500 text-xl font-semibold">Getting User info...</Text>
        </View>
      ) : (
        <View className="flex-1 px-5 py-5 mt-8">
          <View>
            <Text className="text-orange-400 font-bold text-3xl">Settings</Text>
          </View>
          <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          className="h-full flex-1" showsVerticalScrollIndicator={false}>
            <View className="py-3">
              <Text className="text-slate-500 text-2xl py-5">Account</Text>
              <View className="bg-slate-100 shadow-sm w-90 rounded-2xl justify-center">
                <TouchableOpacity
                  className="border border-t-0 border-r-0 border-l-0 border-slate-300 px-3 h-16 flex-row justify-between items-center border-b-slate-300">
                  <Text className="text-2xl font-semibold">{userdata?.userdata?.companyName}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfile', { userEmail: userdata?.userdata?.email })}
                  className="border border-t-0 border-r-0 border-l-0 border-slate-300 px-3 h-16 flex-row justify-between items-center border-b-slate-300">
                  <Text className="text-lg">Edit Profile</Text>
                  <FeatherIcon name="chevron-right" size={23} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Forgot', { email: email })} className="border border-t-0 border-r-0 border-l-0  border-slate-300 px-3 h-16 flex-row justify-between items-center border-b-0">
                  <Text className="text-lg">Change Password</Text>
                  <FeatherIcon name="chevron-right" size={23} />
                </TouchableOpacity>
              </View>


              <Text className="text-slate-500 py-5 text-2xl">More</Text>
              <View className="bg-slate-100 shadow-sm w-90 rounded-2xl justify-center">
                {settingsOptions.map((option, index) => {
                  return (
                    <TouchableOpacity onPress={option.onPress} key={index} className="border border-t-0 border-r-0 border-l-0 border-slate-300 px-3 h-16 flex-row justify-between items-center border-b-slate-300">
                      <Text className="text-lg">{option.title}</Text>
                      <FeatherIcon name="chevron-right" size={23} />
                    </TouchableOpacity>

                  )
                })}


              </View>


              <View className="justify-center items-center">
                <TouchableOpacity onPress={() => setLogoutConfirm(true)} className="bg-orange-400 h-10 rounded-2xl justify-center items-center my-7 w-60">
                  <Text className="text-white text-xl">Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

      )}


      {/* logout confirm */}
      <Modal
        isVisible={isLogoutConfirm}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        onBackdropPress={() => setLogoutConfirm(false)}
        onBackButtonPress={() => setLogoutConfirm(false)}
        style={styles.modalContainer}
      >
        <View
          className=""
          style={[
            styles.bottomSheetContainer1,
            { height: windowHeight * 0.4 },
          ]}
        >
          <View className="justify-center items-center flex-1 w-full h-full">

            <View className="flex-row justify-between items-center w-full px-5">

              <TouchableOpacity onPress={() => setLogoutConfirm(false)} className="bg-orange-400 w-32 h-12 my-3 rounded-2xl justify-center items-center">
                <Text className="text-white font-semibold text-xl">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} className="bg-red-400 w-32 h-12 my-3 rounded-2xl justify-center items-center">
                <Text className="text-white font-semibold text-xl">Logout</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      </Modal>



    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

});

export default SettingScreen;