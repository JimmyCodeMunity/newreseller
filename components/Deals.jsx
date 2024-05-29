import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Dimensions,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { urlFor } from "../sanity";
import { getEvents } from "../api";
import { useNavigation } from "@react-navigation/native";// Assuming you have a Card component for individual items


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Deals = () => {
  const [events, setEvents] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await getEvents();
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const renderCards = () => {
    return events.map((event) => {
      const { title, imageUri, link } = event;
      return (
        <TouchableOpacity key={link} onPress={() => navigation.navigate("webdeals", { link })}>
          <View className="h-40 w-80 rounded-2xl">
            <Image className="h-full w-full" source={{uri:imageUri}}/>
          </View>
        </TouchableOpacity>
      );
    });
  };

  if (events.length === 0) {
    return (
      <View className="flex-row justify-center items-center">
        <Text className="text-slate-600 text-orange-400">No events found</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
      {renderCards()}
    </ScrollView>
  );
};

export default Deals;
