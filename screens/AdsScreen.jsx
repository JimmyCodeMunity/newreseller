import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AdsScreen = ({ navigation }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  //get all the ads
  const getAds = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://res-server-sigma.vercel.app/api/ads/allads"
      );
      const collectedAds = response.data;
      setAds(collectedAds);
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log("error while fetching ads");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAds();
  }, []);
  return (
    <SafeAreaView className="flex-1">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text className="text-slate-500">Fetching Ads and Discounts</Text>
        </View>
      ) : (
        <View>
          <View className="my-5 px-4 flex-row justify-between items-center">
            <Text className="text-2xl text-slate-500">Ads & Discounts</Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-orange-400 h-10 w-10 rounded-full justify-center items-center"
            >
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView vertical={true} className="h-full">
            <View className="flex-1 h-full">
              {ads.map((item) => {
                return (
                  <View className="px-3 shadow shadow-lg space-y-4">
                    <View className="h-40 w-full mb-5">
                      <TouchableOpacity className="py-10">
                        <ImageBackground
                          source={require("../assets/images/adback.jpg")}
                          className="absolute h-40 rounded-2xl overflow-hidden w-full"
                        />

                        <View className="flex-row justify-between px-3">
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
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AdsScreen;

const styles = StyleSheet.create({});
