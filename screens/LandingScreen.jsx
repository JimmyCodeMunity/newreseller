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
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Deals from "../components/Deals";

import axios from "axios";
import { getEvents, getUserdata } from "../api";
import { urlFor } from "../sanity";
import Carousel from "react-native-reanimated-carousel";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const LandingScreen = ({ navigation, route }) => {
  const [categories, setCategories] = useState([""]);
  const [suppliers, setSuppliers] = useState([""]);
  const [ads, setAds] = useState([""]);
  const [userdata, setUserdata] = useState([]);
  const [email, setUseremail] = useState("");
  const [loggedUser, setLoggedUser] = useState("");
  const [showLoginReqModal, setShowLoginReqModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // ... existing code ...

  const onRefresh = async () => {
    setIsRefreshing(true);
    setLoading(true);
    try {
      await getSuppliers(); // Fetch the updated data
      await getCategories();
      await getAds();
      await getEmail();
      // await getUserdata();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    setIsRefreshing(false);
  };
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
  const getSuppliers = async () => {
    try {
      const response = await axios.get(
        "https://res-server-sigma.vercel.app/api/shop/sellers"
      );
      const collected = response.data;
      setSuppliers(collected);
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

  //get events
  const [events, setEvents] = useState([]);
  // console.log("logged email", email);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await getEvents();
        setEvents(eventData);
        // console.log("the event", eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const dealsData = events.map((event) => ({
    title: event.title, // Add title to data for rendering in the carousel
    imageUri: urlFor(event.mainImage).url(),
    link: event.shop,
  }));

  //get userinformation
  // const getUserInfo = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `https://res-server-sigma.vercel.app/api/user/usersdata/${email}`
  //     );
  //     const gotuser = response.data;
  //     console.log(gotuser);
  //     console.log(gotuser.firstName);
  //     setLoggedUser(gotuser.firstName);
  //     setLoading(false);
  //     //   console.log(gotuser.firstName);
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //     alert.alert("Error getting user information..");
  //   }
  // };
  useEffect(() => {
    getUserdata({ email, userdata, setUserdata, setLoading });
  }, [email]);
  // console.log("seller",userdata.companyName)
  const companyName = userdata.companyName;

  useEffect(() => {
    getCategories();
    getSuppliers();
    getAds();
    getEmail();
    // getUserInfo();
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
    <SafeAreaView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../assets/images/resellersplash.png")}
            className="h-16 w-16"
          />
          <Text className="text-xl font-semibold tracking-wide">
            Collecting data....
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <View className="px-5 mt-8 justify-between items-center flex-row py-4">
            <View>
              <Text className="text-slate-600 text-2xl">
                Welcome {companyName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Settings")}
              className="border border-orange-500 border-xl rounded-full p-2"
            >
              <Image
                source={require("../assets/images/resellersplash.png")}
                className="h-10 w-10 rounded-full"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            vertical={true}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            <View>
              <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={events} // Use local images array here
                scrollAnimationDuration={5000}
                // onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={(
                  { item } // Adjusted to handle items
                ) => (
                  <View
                    className="px-3 space-x-5 shadow shadow-lg"
                    style={{
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      className="rounded-2xl border border-slate-200"
                      source={{ uri: urlFor(item.mainImage).url() }} // Use local image
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                )}
              />
            </View>

            <View className="px-5 flex-row justify-between items-center my-4">
              <Text className="text-slate-600 font-semibold text-xl">
                Our Suppliers
              </Text>
              <Pressable onPress={() => navigation.navigate("manufacturers")}>
                <Text className="text-slate-600 text-orange-400">View All</Text>
              </Pressable>
            </View>

            <View className="flex-1 justify-between items-center flex-row px-5">
              {suppliers.slice(0, 4).map((supplier) => {
                return (
                  <TouchableOpacity
                    key={supplier._id}
                    onPress={() =>
                      navigation.navigate("SupplierView", {
                        supplierId: supplier._id,
                        supplierFirstName: supplier.firstName,
                        supplierLastName: supplier.lastName,
                        supplierEmail: supplier.email,
                        supplierPhone: supplier.phoneNumber,
                        supplierExRate: supplier.dollarExchangeRate,
                        supplierAddress: supplier.address,
                        companyName: supplier.companyName,
                      })
                    }
                    className="justify-center items-center bg-slate-300 rounded-full h-20 w-20 p-3"
                  >
                    <Image
                      source={require("../assets/images/reseller.png")}
                      className="h-10 w-10"
                    />
                    <Text className="text-slate-500">
                      {supplier.companyName?.length > 8
                        ? supplier.companyName?.slice(0, 4) + "..."
                        : supplier.companyName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="px-5 flex-row justify-between items-center py-5">
              <Text className="text-slate-600 font-semibold text-xl">
                Product Categories
              </Text>
            </View>

            <View className="w-full flex-row flex-wrap px-5 justify-between items-start">
              {categories.map((category) => {
                return (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() =>
                      navigation.navigate("CategoryView", {
                        categoryName: category.name,
                      })
                    }
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
              <TouchableOpacity onPress={()=>navigation.navigate('Ads')} className="justify-center p-3">
                <Text className="text-orange-500 text-md">View all</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={ads} // Use local images array here
                scrollAnimationDuration={10000}
                // onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={(
                  { item } // Adjusted to handle items
                ) => (
                  <View className="px-3 space-x-1 shadow shadow-lg">
                    <View className="h-60 w-full">
                      <TouchableOpacity className="py-10 px-5">
                        <ImageBackground
                          source={require("../assets/images/adback.jpg")}
                          className="absolute h-40 rounded-2xl overflow-hidden w-full"
                        />

                        <View className="flex-row justify-between">
                          <View>
                            <Text className="text-2xl font-bold">
                              {item.title}
                            </Text>
                            <Text className="text-slate-600 font-semibold">
                              {item.title}
                            </Text>
                            <Text className="text-slate-500 font-semibold line-through">
                              ${item.initialPrice}
                            </Text>
                            <Text className="text-black font-semibold">
                              ${item.newPrice}
                            </Text>
                          </View>
                          <View>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("eventdata", {
                                  itemName: item.title,
                                  supplier: item.supplier,
                                  itemDescription: item.description,
                                  initialprice: item.initialPrice,
                                  newprice: item.newPrice,
                                })
                              }
                              className="bg-white h-12 w-12 rounded-full justify-center items-center"
                            >
                              <Icon name="eye" color="black" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
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
