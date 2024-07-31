import React, { useState, useEffect } from "react";
import { View, Image, Dimensions, Text, TouchableOpacity, ScrollView } from "react-native";
import Carousel from 'react-native-reanimated-carousel';
import { urlFor } from "../sanity";
import { getEvents } from "../api";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;


const images = [
  require('../assets/images/expl1.png'),
  require('../assets/images/expl2.png'),
  require('../assets/images/expl3.png'),
];

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

  const renderCarouselItems = () => {
    return events.map((event) => ({
      uri: event.imageUri, // Assuming imageUri is the URL of the image
    }));
  };

  if (events.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>No events found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <Carousel
        loop
        width={windowWidth}
        height={windowWidth / 2}
        autoPlay={true}
        data={images} // Dynamic data mapping
        scrollAnimationDuration={2000}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.uri} onPress={() => navigation.navigate("webdeals", { link: item.uri })}>
            <View style={{ padding: 10, margin: 5, backgroundColor: '#fff', borderRadius: 20 }}>
              <Image
                source={{ uri: item.uri }}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

export default Deals;
