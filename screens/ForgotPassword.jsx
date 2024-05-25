import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import React from "react";

const ForgotPassword = ({navigation}) => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <View className="w-full px-5 space-y-5 justify-center items-center">
        <Text className="text-xl font-semibold">Forgot Password</Text>
        <TextInput className="h-10 w-80 border border-slate-300 focus:border-orange-400 rounded-md" />
        <TouchableOpacity className="bg-orange-500 w-80 h-12 justify-center items-center rounded-xl">
          <Text className="text-white text-xl">Send reset link</Text>
        </TouchableOpacity>
        <Pressable onPress={() => navigation.goBack()}>
          <Text className="text-orange-400 font-semibold">
            remembered password?
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({});
