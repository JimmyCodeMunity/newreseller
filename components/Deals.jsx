import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Dimensions,
  Text,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { urlFor } from "../sanity";
import { getEvents } from "../api";
import { useNavigation } from "@react-navigation/native";
import CarouselCard from "./Card.jsx";
import ExplainCard from "./ExplainCard.jsx";

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
        console.log("Deals:", dealsData.length);
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

  const renderCarouselItem = ({ item }) => {
    const handleEventPress = () => {
      Linking.openURL(item.link);
    };
    return (
      <View>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("webdeals", { link: item.link })}
          className=""
        >
          <Image
            className="rounded-3xl shadow-lg shadow-gray-900"
            style={{
              width: windowWidth * 0.9,
              height: windowHeight * 0.3,
            }}
            source={{ uri: item.imageUri }}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  //     // Conditionally render the Carousel only when there are more than 2 items
  if (dealsData.length > 0) {
    return (
      <View className="w-full mb-3">
        <Carousel
          data={dealsData}
          renderItem={renderCarouselItem}
          inactiveSlideOpacity={0.8}
          sliderWidth={windowWidth}
          itemWidth={windowWidth * 0.82}
          itemHeight={windowHeight * 0.3}
          slideStyle={{ display: "flex", alignItems: "center" }}
          loop={true}
          autoplay={true}
          autoplayInterval={3000}
          layout={"stack"}
          layoutCardOffset={`18`}
        />
      </View>
    );
  } else {
    // Render something else or nothing if there are 2 or fewer items
    return <ExplainCard />;
  }
};

export default Deals;
