import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useLayoutEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ChatRoom = ({ navigation, route }) => {
  const { chat } = route.params;

  useLayoutEffect(() => {
    return navigation.setOptions({
      headerTitle: "",
      headerLeft: () => {
        return (
          <View className="flex-row items-center justify-between space-x-5">
            <View>
              <Pressable onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={30} color="black" />
              </Pressable>
            </View>
            <View>
              <Text className="text-xl font-semibold">{chat?.name}</Text>
            </View>
          </View>
        );
      },
    });
  });
  return (
    <View className="absolute bottom-6 w-full px-4 flex-row space-x-4 items-center justify-between">
      <View className="w-[85%]">
        <TextInput
          placeholder="enter text"
          className="h-12 border border-slate-300 border-1 px-4 rounded-xl h-10 w-full"
        />
      </View>
      <View className="w-[20%]">
        <Pressable className="rounded-full h-10 w-10 bg-orange-500 justify-center items-center">
          <Icon name="send" size={30} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({});
