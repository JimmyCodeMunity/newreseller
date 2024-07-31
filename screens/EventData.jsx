import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    Linking
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { StatusBar } from "expo-status-bar";
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  import axios from "axios";
  import Loading from "../components/Loading";
  
  const EventData = ({ navigation, route }) => {
    const {
      itemName,
      itemDescription,
      itemOriginal,
      itemDiscount,
      supplier,
      itemPhone,
      initialprice,
      newprice
    } = route.params;
  
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [companyName,setCompanyName] = useState('')
    const [phonenumber, setPhoneNumber] = useState('')
    const [exchangeRate, setExchangeRate] = useState('')
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false)
  
  
    //get suppliers data
    const getSupplierInfo = async () => {
      setLoading(true);
      // console.log(loading)
      try {
        const response = await axios.get(`https://res-server-sigma.vercel.app/api/shop/usersdata/${supplier}`);
        const supdata = response.data;
        const erate = response.data.user.dollarExchangeRate;
        const fname = response.data.user.firstName;
        const lname = response.data.user.lastName;
        const phone = response.data.user.phoneNumber;
        const cat = response.data.user.categories;
        const company = response.data.user.companyName;
        const categoryText = cat.join(", ");
        setExchangeRate(erate);
        setFirstName(fname);
        setLastName(lname);
        setPhoneNumber(phone);
        setCategory(categoryText);
        setCompanyName(company);
        // console.log("cat",categoryText)
        // setSupplierData(supdata);
        // console.log("supdata", supdata)
        setLoading(false)
  
      } catch (error) {
        console.log("error fetching....")
  
      }
    }
  
    useEffect(() => {
      getSupplierInfo();
    }, [])
  
  
  
    const handleCall = () => {
      const cphoneNumber = phonenumber.slice(-9);
      const countryCode = "+254";
  
      // Check if the phone number is valid
      if (cphoneNumber) {
        const fullPhoneNumber = `${countryCode}${cphoneNumber}`;
        // Construct the phone call URL
        const phoneURL = `tel:${fullPhoneNumber}`;
  
        // Open the phone app with the specified phone number
        Linking.canOpenURL(phoneURL)
          .then((supported) => {
            if (!supported) {
              console.error("Phone calls are not supported on this device");
            } else {
              return Linking.openURL(phoneURL);
            }
          })
          .catch((error) => console.error(`Error opening phone app: ${error}`));
      } else {
        console.error("Phone number is not available");
      }
    };
  
    //handle whatsapp
    const handleWhatsapp = () => {
      const wphoneNumber = phonenumber.slice(-9);
      const countryCode = "+254";
      if (wphoneNumber) {
        const fullPhoneNumber = `${countryCode}${wphoneNumber}`;
        const phoneURL = `tel:${fullPhoneNumber}`;
        // Construct the WhatsApp chat URL
        const whatsappURL = `https://wa.me/${fullPhoneNumber}`;
  
        // Open the WhatsApp chat with the specified phone number
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
    return (
      <SafeAreaView className="flex-1">
        <StatusBar style="light" />
        <View>
          {loading ? (
            <View className="flex-1 justify-center items-center">
                <Text className="text-xl font-semibold">Getting Info...</Text>
            </View>
          ) : (
            <ScrollView>
              <View className="relative">
                <Image
                  className="w-full h-80"
                  source={require("../assets/resell.png")}
                />
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="absolute top-14 left-4 bg-orange-50 p-2 rounded-full shadow border border-slate-200 border-b-xl"
                >
                  <Icon name="arrow-left" color="black" size={30}/>
                </TouchableOpacity>
              </View>
  
              <View className="px-5 py-4">
                <View className="my-2">
                  <Text className="text-3xl font-bold text-gray-900">{itemName}</Text>
                </View>
                <View className="my-1">
                  <Text className="text-2xl font-bold text-gray-900">
                    {itemDescription}
                  </Text>
                </View>
                <View className="my-1">
                  <Text className="font-bold tracking-wide ">
                    Supplier:
                    <Text className="text-lg font-bold text-gray-900">
                      {companyName}
                    </Text>
                  </Text>
                </View>
                <View className="my-1">
                  <Text className="font-bold tracking-wide ">
                    Initial Price:
                    <Text className="text-lg font-bold text-slate-500 line-through">
                      ${initialprice}
                    </Text>
                  </Text>
                </View>
                <View className="my-1">
                  <Text className="font-bold tracking-wide ">
                    New Price:
                    <Text className="text-lg font-bold text-gray-900">
                      ${newprice}
                    </Text>
                  </Text>
                </View>
                <View className="my-1">
                  <Text className="font-bold tracking-wide ">
                    Exchange Rate:
                    <Text className="text-lg font-bold text-gray-900">
                      {exchangeRate}
                    </Text>
                  </Text>
                </View>
                <View className="my-1">
                  <Text className="font-bold tracking-wide ">
                    Category:
                    <Text className="text-lg font-bold text-gray-900">
                      {category}
                    </Text>
                  </Text>
                </View>
  
  
              </View>
  
              <View className="px-4 w-full flex-1">
                <View className="py-2">
                  <TouchableOpacity
                    onPress={handleWhatsapp}
                    className="rounded-2xl flex-row bg-green-500 p-2 w-90 h-12 justify-center items-center"
                  >
                    <Icon name="whatsapp" color="white" size={30} />
                    <Text className="text-2xl font-semibold text-slate-700">
                      Chat
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="py-2">
                  <TouchableOpacity
                    onPress={handleCall}
                    className="rounded-2xl flex-row p-2 bg-black w-90 h-12 justify-center items-center"
                  >
                    <Icon name="phone" size={30} color="white" />
                    <Text className="text-2xl font-semibold text-slate-200">
                      Call
                    </Text>
                  </TouchableOpacity>
                </View>
                
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    );
  };
  
  export default EventData;
  
  const styles = StyleSheet.create({});