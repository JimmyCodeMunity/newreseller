import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ChatScreen = ({ navigation, route }) => {
  const chats = [
    {
      id: 1,
      name: "John Doe",
      message: "Hi, How are you?",
      timestamp: "10:00 AM",
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Hi, I'm looking for a product.",
      timestamp: "10:10 AM",
    },
    {
      id: 3,
      name: "Suel",
      message: "I found it!",
      timestamp: "10:20 AM",
    },
    {
      id: 4,
      name: "Clava Smith",
      message: "Thank you!",
      timestamp: "10:30 AM",
    },
  ];

  const RenderChat = ({ chat }) => {
    return (
      <TouchableOpacity
      onPress={()=>navigation.navigate('ChatRoom',{chat:chat})}
      className="w-full h-12 mb-4 flex-row items-center space-x-1 justify-between">
        <View className="h-full w-[20%] justify-center items-center">
          <View className="w-12 h-12 bg-slate-200 rounded-full"></View>
        </View>
        <View className="h-full w-[80%] border border-1 pr-4 flex-row items-center justify-between border-slate-200 border-t-0 border-r-0 border-l-0">
          <View>
            <Text className="text-lg">{chat?.name}</Text>
            <Text className="text-slate-300 text-sm">
              {chat?.message.slice(0, 16) + "..."}
            </Text>
          </View>
          <View>
            <Text className="text-sm text-slate-400">{chat?.timestamp}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View
        className={`${
          Platform.OS === "android" ? "mt-8" : "mt-1"
        } flex py-8 flex-row items-center justify-between w-full px-4`}
      >
        <View>
          <Text className="text-2xl font-semibold">Chats</Text>
        </View>
        <View>
          <Icon name="menu" size={25} />
        </View>
      </View>

      <View className="justify-center items-center w-full px-4">
        <TextInput
          placeholder="Search Supplier Name"
          className="h-12 rounded-xl h-10 px-4 border border-1 border-slate-300 w-full"
        />

        {/* chats */}
        <View className="w-full my-5">
          <FlatList
            data={chats}
            renderItem={({ item }) => <RenderChat chat={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
