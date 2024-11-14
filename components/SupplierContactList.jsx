import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";

const windowHeight = Dimensions.get("window").height;

const SupplierContactList = forwardRef(({ searching, setSearching }, ref) => {
  const translateY = useSharedValue(windowHeight);
  const context = useSharedValue({ y: 0 });
  const active = useSharedValue(false);

  const MAX_TRANSLATE_Y = -windowHeight + 70;

  const scrollTo = useCallback((destination) => {
    "worklet";
    active.value = destination !== windowHeight;
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  useImperativeHandle(ref, () => ({
    scrollTo,
    isActive,
  }));

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(
        event.translationY + context.value.y,
        MAX_TRANSLATE_Y
      );
    })
    .onEnd(() => {
      if (translateY.value > -windowHeight / 2) {
        scrollTo(windowHeight);
      } else {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  useEffect(() => {
    scrollTo(windowHeight);
  }, []);

  const bottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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
      const response = await axios.get(
        `https://res-server-sigma.vercel.app/api/shop/sellers`
      );
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
          onPress={() => {
            // Hide the bottom sheet before navigating
            scrollTo(windowHeight);  // Hide the bottom sheet
      
            // Use a timeout to ensure the bottom sheet hides before navigating
            setTimeout(() => {
              navigation.navigate("InChatRoom", {
                companyId: item._id,
                supplierFirstName: item.firstName,
                supplierLastName: item.lastName,
                supplierEmail: item.email,
                supplierPhone: item.phoneNumber,
                supplierExRate: item.dollarExchangeRate,
                supplierAddress: item.address,
                companyName: item.companyName,
              });
            }, 300); // Adjust the timeout duration if necessary
          }}
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="flex-1">
            <Text className="text-lg font-semibold text-black">
              {item.companyName}
            </Text>
            <Text className="text-sm text-gray-500">{item.country}</Text>
          </View>
          <Text className="text-sm text-gray-400">
            Exchange Rate: {item.dollarExchangeRate}
          </Text>
        </TouchableOpacity>
      );
      

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomsheet, bottomSheetStyle]}>
        <View style={styles.handleBarContainer}>
          <View style={styles.handleBar}></View>
        </View>

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
                  <Text className="text-lg font-semibold text-gray-500">
                    {title}
                  </Text>
                </View>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                />
              }
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </SafeAreaView>
      </Animated.View>
    </GestureDetector>
  );
});

export default SupplierContactList;

const styles = StyleSheet.create({
  bottomsheet: {
    height: windowHeight,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    top: windowHeight,
  },
  handleBarContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  contentContainer: {
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "gray",
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    width: 120,
    alignItems: "center",
  },
  cancelText: {
    color: "white",
    fontWeight: "600",
  },
});
