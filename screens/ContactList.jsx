import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";

const ContactList = () => {
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchResellers();
  }, []);

  const fetchResellers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://res-server-sigma.vercel.app/api/shop/sellers`);
      const sortedResellers = response.data.sort((a, b) =>
        a.companyName.localeCompare(b.companyName)
      );
      setResellers(sortedResellers);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch resellers", error.message);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchResellers();
    setIsRefreshing(false);
  };

  // Filter and group resellers by the first letter of the company name
  const filteredResellers = resellers.filter(
    (reseller) =>
      reseller.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reseller.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedResellers = filteredResellers.reduce((acc, reseller) => {
    const firstLetter = reseller.companyName.charAt(0).toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(reseller);
    return acc;
  }, {});

  const sections = Object.keys(groupedResellers)
    .sort()
    .map((letter) => ({
      title: letter,
      data: groupedResellers[letter],
    }));

  const renderReseller = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("InChatRoom", {
          companyId: item._id,
          supplierFirstName: item.firstName,
          supplierLastName: item.lastName,
          supplierEmail: item.email,
          supplierPhone: item.phoneNumber,
          supplierExRate: item.dollarExchangeRate,
          supplierAddress: item.address,
          companyName: item.companyName,
        })
      }
      className="flex-row items-center p-4 border-b border-gray-200"
    >
      <View className="flex-1">
        <Text className="text-lg font-semibold text-black">{item.companyName}</Text>
        <Text className="text-sm text-gray-500">{item.country}</Text>
      </View>
      <Text className="text-sm text-gray-400">Exchange Rate: {item.dollarExchangeRate}</Text>
    </TouchableOpacity>
  );


  useLayoutEffect(() => {
    return navigation.setOptions({
      headerTitle: "Start Chat",
      headerLeft: () => {
        return (
          <View className="flex-row items-center justify-between space-x-5">
            <View>
              <Pressable onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={30} color="black" />
              </Pressable>
            </View>
            <View>
              <Text className="text-xl font-semibold">
                
              </Text>
            </View>
          </View>
        );
      },
    });
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      

      <View className="p-4">
        <TextInput
          className="border border-gray-300 p-3 rounded-2xl"
          placeholder="Search by name, country, exchange rate..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="gray" />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderReseller}
          renderSectionHeader={({ section: { title } }) => (
            <View className="bg-gray-100 p-2 pl-4">
              <Text className="text-lg font-semibold text-gray-500">{title}</Text>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

export default ContactList;
