import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPassword from "../screens/ForgotPassword";
import FirstScreen from "../screens/FirstScreen";
import ExplainerScreen from "../screens/ExplainerScreen";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeatherIcon from "react-native-vector-icons/Feather";
import {
  Provider as PaperProvider,
  DefaultTheme,
  Modal,
} from "react-native-paper";
import { CurrencyProvider } from "../components/CurrrencyProvider";
import SearchScreen from "../screens/SearchScreen";
import LandingScreen from "../screens/LandingScreen";
import SettingScreen from "../screens/SettingScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ProfileScreen from "../screens/ProfileScreen";
import CategoryViewScreen from "../screens/CategoryViewScreen";
import SupplierViewScreen from "../screens/SupplierViewScreen";
import EditProfile from "../screens/EditProfileScreen";
import ResetPassword from "../screens/ResetPasswordScreen";
import ViewProduct from "../screens/ViewProduct";
import EventData from "../screens/EventData";
import ManufacturerScreen from "../screens/Manufacturers";
import CategoryScreen from "../screens/CategoriesScreen";
import PrivacyPolicy from "../screens/PrivacyPolicyScreen";
import FaqScreen from "../screens/FaqScreen";
import OurStory from "../screens/OurStoryScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdsScreen from "../screens/AdsScreen";
import ChatScreen from "../screens/ChatScreen";
import ChatRoom from "../screens/ChatRoom";
import InChatRoom from "../screens/InChatRoom";
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <CurrencyProvider>
        <Stack.Navigator>
          {!isLoggedIn ? (
            <>
              <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="Forgot"
                component={ForgotPassword}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="First"
                component={FirstScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Home"
                component={BottomTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Explainer"
                component={ExplainerScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerShown: false, presentation: "modal" }}
              />
              <Stack.Screen
                name="CategoryView"
                component={CategoryViewScreen}
                options={{ headerShown: false, presentation: "modal" }}
              />
              <Stack.Screen
                name="SupplierView"
                component={SupplierViewScreen}
                options={{ headerShown: false, presentation: "modal" }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{ headerShown: false, presentation: "modal" }}
              />
              <Stack.Screen
                name="passreset"
                component={ResetPassword}
                options={{ headerShown: false, presentation: "modal" }}
              />
              <Stack.Screen
                name="viewproduct"
                component={ViewProduct}
                options={{ headerShown: false, presentation: "modal" }}
              />
              <Stack.Screen
                name="eventdata"
                component={EventData}
                options={{ headerShown: false, presentation: "modal" }}
              />
              <Stack.Screen
                name="manufacturers"
                component={ManufacturerScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="categories"
                component={CategoryScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="story"
                component={OurStory}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="faq"
                component={FaqScreen}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="ChatRoom"
                component={ChatRoom}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="InChatRoom"
                component={InChatRoom}
                options={{ headerShown: true ,presentation:"modal"}}
              />
              <Stack.Screen
                name="policy"
                component={PrivacyPolicy}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="Ads"
                component={AdsScreen}
                options={{
                  headerShown: false,
                  presentation: "fullscreenModal",
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </CurrencyProvider>
    </NavigationContainer>
  );
};

//bottomnavigation
const BottomTabs = ({ route }) => {
  const [isDollar, setIsDollar] = useState(false);
  // const { email } = route.params;
  const [email, setEmail] = useState("");
  useEffect(() => {
    const checkLogedinStatus = async () => {
      try {
        const loginStatus = await AsyncStorage.getItem("loginStatus");
        const loginEmail = await AsyncStorage.getItem("email");
        setEmail(loginEmail);
        //console.log(loginEmail)
        return loginStatus === "LoggedIn";
      } catch (error) {
        console.log("Error checking login status:", error);
        return false;
      }
    };

    checkLogedinStatus();
  }, []);

  return (
    <CurrencyProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Shop") {
              iconName = "home";
            } else if (route.name === "Categories") {
              iconName = "cart";
            } else if (route.name === "Search") {
              iconName = "magnify";
            } else if (route.name === "Settings") {
              iconName = "cog";
            } else if ((route.name = "Chats")) {
              iconName = "chat";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "orange", // Change the active tab color to your desired color
          inactiveTintColor: "gray", // Change the inactive tab color to your desired color
        }}
      >
        <Tab.Screen
          name="Shop"
          component={LandingScreen}
          initialParams={{ email }}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="Search"
          component={SearchScreen}
          initialParams={{ email }}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="Chats"
          component={ChatScreen}
          initialParams={{ email }}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="Settings"
          component={SettingScreen}
          initialParams={{ email }}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </CurrencyProvider>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
