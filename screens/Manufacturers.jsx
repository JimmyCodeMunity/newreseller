import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    RefreshControl,
    ActivityIndicator
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import Loading from "../components/Loading";
  import Animated, { SlideInDown, SlideInLeft } from "react-native-reanimated";
  import * as Icon from "react-native-feather";
import { useCurrency } from "../components/CurrrencyProvider";
  
  
  const ManufacturerScreen = ({ navigation, route }) => {
    const [manufacturer, setManufacturer] = useState([]);
    const { isDollar, setIsDollar } = useCurrency();
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
  
    //fetch manufactures
    useEffect(() => {
      fetchManufacturer();
    }, []);
  
    const fetchManufacturer = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://res-server-sigma.vercel.app/api/shop/sellers`
        );
        setManufacturer(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
  
    //handle refresh
    const onRefresh = async () => {
      setIsRefreshing(true);
      try {
        await fetchManufacturer(); // Fetch the updated data
      } catch (error) {
        console.log(error);
      }
      setIsRefreshing(false);
    };
  
    //filter
    const filteredManufacturers = manufacturer.filter((manufacturer) =>
      manufacturer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manufacturer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manufacturer.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manufacturer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manufacturer.dollarExchangeRate.toFixed().includes(searchQuery.toLowerCase())
  
    );
    return (
      <SafeAreaView className="flex-1 bg-white">
        
        <SafeAreaView className="justify-center items-center mt-8">
        <View className="flex-row justify-between px-4 w-full items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-orange-200 p-2 w-12 h-12 rounded-full shadow border border-slate-200 border-b-xl"
        >
          <Icon.ArrowLeft strokeWidth={3} stroke="orange" />
        </TouchableOpacity>
        
          <Text className="text-orange-500 font-bold text-2xl">
            All Suppliers
          </Text>
          </View>
        </SafeAreaView>
        <View className="p-5 justify-center items-center">
          <TextInput
            className="h-12 w-full border border-slate-300 px-5 rounded-2xl"
            placeholder="Search by name,ex.rate,company,country.."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
        <ScrollView
          vertical={true}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="gray" />
              </View>
          ) : (
            <Animated.View
              entering={SlideInLeft.delay(400).springify()}
              className="flex-1 px-5"
            >
              {filteredManufacturers.map((supplier) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("SupplierView", {
                            supplierId: supplier._id,
                            supplierFirstName: supplier.firstName,
                            supplierLastName: supplier.lastName,
                            supplierEmail: supplier.email,
                            supplierPhone: supplier.phoneNumber,
                            supplierExRate: supplier.dollarExchangeRate,
                            supplierAddress: supplier.address,
                          })
                    }
                    key={manufacturer._id}
                  >
                    <View className="space-y-1 mr-4 my-2" key={manufacturer.id}>
                      <View className="flex-row justify-between items-center p-2 rounded-2xl h-18 w-18 border border-orange-400 border-md">
                        <View>
                          <Image
                            className="rounded-full"
                            source={require("../assets/images/resellersplash.png")}
                            style={{
                              height: 60,
                              width: 60,
                            }}
                            resizeMode="cover"
                          />
                        </View>
                        <View className="justify-start" style={{ width: "50%" }}>
                          <Text className="text-neutral-600 mt-3 font-bold">
                            {supplier.firstName.length > 12
                              ? supplier.firstName.slice(0, 12) + "..."
                              : supplier.firstName}
                          </Text>
                          <Text>Exchange Rate:{supplier.dollarExchangeRate}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default ManufacturerScreen;
  
  const styles = StyleSheet.create({});