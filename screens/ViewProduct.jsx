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
  import { Switch } from "react-native";
  
  const ViewProduct = ({ navigation, route }) => {
    const {
      supplier,
      name,
      price,
      brand,
      desc,
      categ,
      status
    } = route.params;
  
  
    const [isDollar, setIsDollar] = useState(false);
  
    const convertToDollar = () => {
      return `KES${(price * exchangeRate).toFixed(2)}`;
    };
    const toggleCurrency = () => {
      setIsDollar(prevState => !prevState);
    };
  
  
    const [exchangeRate, setExchangeRate] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [category, setCategory] = useState([]);
    const [supplierData, setSupplierData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [companyname,setCompanyname] = useState('')  
  
    const fetchSupplierDetails = async () => {
      setLoading(true);
      console.log(loading)
      try {
        const response = await axios.get(`https://res-server-sigma.vercel.app/api/shop/usersdata/${supplier}`);
        const supdata = response.data;
        const erate = response.data.user.dollarExchangeRate;
        const fname = response.data.user.firstName;
        const cname = response.data.user.companyName;
        const lname = response.data.user.lastName;
        const phone = response.data.user.phoneNumber;
        const cat = response.data.user.categories;
        const categoryText = cat.join(", ");
        setExchangeRate(erate);
        setFirstName(fname);
        setCompanyname(cname);
        setLastName(lname);
        setPhoneNumber(phone);
        setCategory(categoryText);
        // console.log("cat",categoryText)
        setSupplierData(supdata);
        // console.log("supdata", supdata)
  
  
      } catch (error) {
        console.log("error fetching....")
  
      }
    }
  
  
  
    useEffect(() => {
      fetchSupplierDetails()
  
    }, [])
  
  
  
    const handleCall = () => {
      const cphoneNumber = phoneNumber.slice(-9);
      const countryCode = "+254";
  
      // Check if the phone number is valid
      if (cphoneNumber) {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;
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
      const wphoneNumber = phoneNumber;
      // const countryCode = "+254";
      if (wphoneNumber) {
        const fullPhoneNumber = `${phoneNumber}`;
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
        <ScrollView>
          <View className="relative">
            <Image
              className="w-full h-80"
              source={require("../assets/images/resellersplash.png")}
            />
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute top-14 left-4 bg-orange-50 p-2 rounded-full shadow border border-slate-200 border-b-xl"
            >
              <Icon name="arrow-left" strokeWidth={3} size={25} stroke="orange" />
            </TouchableOpacity>
          </View>
  
          <View className="px-5 py-4">
            <View className="my-2">
              <Text className="text-3xl font-bold text-gray-900">{name}</Text>
            </View>
            <View className="my-1">
              <Text className="text-2xl font-bold text-gray-900">
                {desc}
              </Text>
            </View>
            <View className="my-1">
              <Text className="font-bold tracking-wide ">
                Supplier:
                <Text className="text-lg font-bold text-gray-900">
                  {companyname}
                </Text>
              </Text>
            </View>
            <View className="my-1">
              <Text className="font-bold tracking-wide ">
                ExchangeRate:
                <Text
                  className="text-lg font-bold text-gray-900"
                >
                  {exchangeRate}
                </Text>
              </Text>
            </View>
            <View className="my-1">
              <Text className="font-bold tracking-wide ">
                Current Price:
                <Text className="text-lg font-bold text-gray-900">
                  {isDollar ? convertToDollar() : `$${price}`}
                </Text>
              </Text>
            </View>
            <View className="my-1">
              <Text className="font-bold tracking-wide ">
                Availablity:
                <Text className="text-lg font-bold text-gray-900">
                  {status == "available" ?
                    <Text className="text-green-500">Available</Text> : <Text className="text-red-500">Unavailable</Text>
                  }
                </Text>
              </Text>
            </View>
            <View className="my-1 flex-row justify-between items-center">
              <View>
                {!isDollar ? 
                  <Text className="text-green-600">Convert to KES</Text>:
                  <Text className="text-yellow-600">Convert to Dollar</Text>
                }
              </View>
              <View>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isDollar ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleCurrency}
                  value={isDollar}
                /></View>
            </View>
          </View>
  
  
  
          <View className="px-4 w-full flex-1">
            <View className="py-2">
              <TouchableOpacity
                onPress={handleWhatsapp}
                className="rounded-2xl flex-row bg-green-500 p-2 w-90 h-12 justify-center items-center"
              >
                <Icon name="whatsapp" size={23} color={"white"} />
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
                <Icon name="phone" size={23} color={"white"} />
                <Text className="text-2xl font-semibold text-slate-200">
                  Call
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default ViewProduct;
  
  const styles = StyleSheet.create({});