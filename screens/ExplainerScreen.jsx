import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ExplainerScreen = ({navigation}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      id: 1,
      description:
        "The platform has current price and dollar rates for your go-to suppliers.",
      image: require("../assets/images/expl1.png"),
      backgroundColor: "bg-white",
      textColor:"text-black",
      buttonColor:'bg-orange-400',
      dotColor:'bg-black'
    },
    {
      id: 2,
      description:
        "Are you a reseller? Concentrate on business, We have the PRICE LISTS.",
      image: require("../assets/images/expl2.png"),
      backgroundColor: "bg-orange-400",
      textColor:"text-black",
      buttonColor:'bg-black',
      dotColor:'bg-black'
    },
    {
      id: 3,
      description:
        "Are you a wholesaler? Reach your customers faster.",
      image: require("../assets/images/expl3.png"),
      backgroundColor: "bg-black",
      textColor:"text-orange-500",
      buttonColor:'bg-orange-400',
      dotColor:'bg-orange-500'
    },
  ];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      navigation.replace("Login"); // Navigate to the Login screen when onboarding is completed
    }
  };

  const renderDots = () => {
    return slides.map((slide, index) => (
      <View
        key={slide.id}
        style={[styles.dot, index === activeSlide ? styles.activeDot : null]}
      />
    ));
  };

  const Next = ({ handlenext }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={handleNext}
          className={`h-12 w-12 rounded-full justify-center items-center ${slides[activeSlide].buttonColor}`}
        >
          <Icon name="arrow-Right" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  const Start = ({ handlenext }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={handleNext}
          className="bg-orange-500 h-10 w-60 rounded-2xl justify-center items-center"
        >
          <Text className="text-white text-md font-semibold">Get Started</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView className={`flex-1 justify-center items-center ${slides[activeSlide].backgroundColor}`}>
      <Image source={slides[activeSlide].image} style={styles.slideImage} />
      <View className="justify-center items-center px-8 text-center">
        <Text
          className={`text-slate-600 mb-5 text-lg font-semibold text-center ${slides[activeSlide].textColor}`}
          style={styles.slideDescription}
        >
          {slides[activeSlide].description}
        </Text>
      </View>

      <View style={styles.dotsContainer}>{renderDots()}</View>

      <View className="w-full justify-center items-center absolute bottom-10">
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {activeSlide === slides.length - 1 ? (
              <Start handlenext={handleNext} />
            ) : (
              <Next handlenext={handleNext} />
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ExplainerScreen;

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  dot: {
    width: 30,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#CCCCCC",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "orange",
  },
});
