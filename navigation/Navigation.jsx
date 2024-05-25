import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <CurrencyProvider>
        <Stack.Navigator>
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
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="Forgot"
            component={ForgotPassword}
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="First"
            component={FirstScreen}
            options={{ headerShown: false }}
          />
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
        </Stack.Navigator>
      </CurrencyProvider>
    </NavigationContainer>
  );
};

//bottomnavigation
const BottomTabs = ({ route }) => {
  const [isDollar, setIsDollar] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    getEmail();
  }, []);
  const getEmail = async () => {
    const savedEmail = await AsyncStorage.getItem("email");
    setEmail(savedEmail);
  };

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
