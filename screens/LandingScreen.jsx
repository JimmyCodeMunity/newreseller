import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Icon from "react-native-feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Deals from "../components/Deals";

import axios from "axios";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const LandingScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([""]);
  const [resellers, setResellers] = useState([""]);
  const [ads, setAds] = useState([""]);
  const [useremail, setUseremail] = useState("");
  const [loggedUser, setLoggedUser] = useState("");
  const [showLoginReqModal, setShowLoginReqModal] = useState(false);
  const [loading, setLoading] = useState(false);
  //get all categories
  const getCategories = async () => {
    try {
      const response = await axios.get(
        "https://res-server-sigma.vercel.app/api/category/allcategories"
      );
      const collected = response.data;
      setCategories(collected);
    } catch (error) {
      console.log(error);
    }
  };
  const getResellers = async () => {
    try {
      const response = await axios.get(
        "https://res-server-sigma.vercel.app/api/user/usersdata"
      );
      const collected = response.data;
      setResellers(collected);
    } catch (error) {
      console.log(error);
    }
  };

  const getAds = async () => {
    try {
      const response = await axios.get(
        "https://res-server-sigma.vercel.app/api/ads/allads"
      );
      const collectedAds = response.data;
      setAds(collectedAds);
    } catch (error) {
      console.log(error);
      console.log("error while fetching ads");
    }
  };

  const getEmail = async () => {
    try {
      const email = await AsyncStorage.getItem("email");
      setUseremail(email);
    } catch (error) {
      console.log(error);
    }
  };

  //get userinformation
  const getUserInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://res-server-sigma.vercel.app/api/user/usersdata/${useremail}`
      );
      const gotuser = response.data[0];
      setLoggedUser(gotuser.firstName);
      setLoading(false);
      //   console.log(gotuser.firstName);
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert.alert("Error getting user information..");
    }
  };

  useEffect(() => {
    getCategories();
    getResellers();
    getAds();
    getEmail();
    getUserInfo();
  }, []);

  //show login modal

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to show the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to hide the modal
  const hideModal = () => {
    setIsModalVisible(false);
  };
  return (
    <SafeAreaView className="flex-1">
      {loading ? (
        <View className="flex-1 justify-center items-center">
            <Image source={require('../assets/images/resellersplash.png')}
            className="h-16 w-16"
            />
          <Text className="text-xl font-semibold tracking-wide">Collecting data....</Text>
        </View>
      ) : (
        <View className="flex-1">
          <View className="px-5 mt-8 justify-between items-center flex-row py-4">
            <View>
              <Text className="text-slate-600 text-2xl">
                Welcome {loggedUser}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              className="border border-orange-500 border-xl rounded-full p-2"
            >
              <Image
                source={require("../assets/images/resellersplash.png")}
                className="h-10 w-10 rounded-full"
              />
            </TouchableOpacity>
          </View>

          <View className="py-4 justify-between items-center w-full px-5 flex-row">
            <TextInput
              className="border border-slate-300 rounded-xl w-80 h-10 px-4"
              placeholder="search products,resellers,brands...."
            />
            <TouchableOpacity
              onPress={showModal}
              className="h-10 w-10 bg-black rounded-xl justify-center items-center "
            >
              <Icon.Search color="white" size={12} />
            </TouchableOpacity>
          </View>
          <ScrollView vertical={true}>
            <View className="justify-center items-center px-5 py-5">
              <View className="w-full bg-black h-40 rounded-2xl"></View>
            </View>

            <View className="px-5 flex-row justify-between items-center my-4">
              <Text className="text-slate-600 font-semibold text-xl">
                Our Suppliers
              </Text>
              <Text className="text-slate-600 text-orange-400">View more</Text>
            </View>

            <View className="w-full flex-row px-5 justify-between items-center">
              {resellers.slice(0, 4).map((reseller) => {
                return (
                  <TouchableOpacity
                    onPress={()=>navigation.navigate('SupplierView',{supplierId:reseller._id})}
                    className="justify-center items-center bg-slate-300 rounded-full h-20 w-20 p-3"
                  >
                    <Image
                      source={require("../assets/images/reseller.png")}
                      className="h-10 w-10"
                    />
                    <Text className="text-slate-500">{reseller.firstName}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="px-5 flex-row justify-between items-center py-5">
              <Text className="text-slate-600 font-semibold text-xl">
                Product Categories
              </Text>
              <Text className="text-slate-600 text-orange-400">View all</Text>
            </View>

            <View className="w-full flex-row px-5 justify-between items-center">
              {categories.slice(0, 4).map((category) => {
                return (
                  <TouchableOpacity
                    onPress={()=>navigation.navigate("CategoryView",{categoryName:category.name})}
                    className="justify-center items-center rounded-2xl h-20 w-20 p-3"
                  >
                    <Image
                      source={require("../assets/images/folder.png")}
                      className="h-10 w-10"
                    />
                    <Text className="text-slate-500">{category.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="px-5 flex-row justify-between items-center py-5">
              <Text className="text-slate-600 font-semibold text-xl">
                Ads & Discounts
              </Text>
              <Text className="text-slate-600 text-orange-400">View all</Text>
            </View>

            <ScrollView
              className="space-x-6"
              horizontal={true}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              showsHorizontalScrollIndicator={false}
            >
              {ads.map((ad) => {
                return (
                  <View className="h-60 w-80">
                    <TouchableOpacity
                      onPress={showModal}
                      className="py-10 px-5"
                    >
                      <ImageBackground
                        source={require("../assets/images/adback.jpg")}
                        className="absolute h-40 rounded-2xl overflow-hidden w-80"
                      />

                      <View className="flex-row justify-between">
                        <View>
                          <Text className="text-2xl font-bold">{ad.title}</Text>
                          <Text className="text-slate-600 font-semibold">
                            {ad.title}
                          </Text>
                          <Text className="text-black font-semibold">
                            Ksh.{ad.initialPrice}
                          </Text>
                          <Text className="text-black font-semibold">
                            Ksh.{ad.newPrice}
                          </Text>
                        </View>
                        <View>
                          <TouchableOpacity className="bg-white h-12 w-12 rounded-full justify-center items-center">
                            <Icon.ChevronRight size={14} color="oran˝ge" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </ScrollView>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={hideModal}
          >
            <View style={styles.centeredView}>
              <View
                style={styles.modalView}
                className="bg-white space-y-4 w-[80%] p-10 rounded-2xl"
              >
                <Text className="text-xl font-semibold text-center text-slate-600">
                  You are not yet Logged in!!
                </Text>
                <TouchableOpacity
                  className="bg-orange-400 h-10 w-60 rounded-xl justify-center items-center"
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.textStyle}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-black h-10 w-60 rounded-xl justify-center items-center"
                  onPress={hideModal}
                >
                  <Text className="text-red-500 text-xl">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    // margin: 20,
    // backgroundColor: 'white',
    // borderRadius: 20,
    // padding: 35,
    // alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
