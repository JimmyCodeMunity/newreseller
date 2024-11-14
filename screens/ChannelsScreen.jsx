import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../config";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useSocketContext } from "../context/SocketContext";

const ChannelsScreen = ({ navigation }) => {
  const { userdata } = useContext(AuthContext);
  const userId = userdata?.userdata?._id;
  const [chatList, setChatList] = useState([]);
  const [search, setSearch] = useState("");
  const { socket } = useSocketContext();
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    fetchChats();
  }, []);

  // listen forn any new chat
  useEffect(() => {
    socket?.on("receiveMessage", (messageData) => {
      fetchChats();
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: `New message`,
        textBody: `${messageData.content}`,
      });
      console.log("message data", messageData);
    });
  }, []);

  const fetchChannels = async () => {
    try {
      console.log("baseurl", BASE_URL);
      const response = await axios.get(`${BASE_URL}/get-channels/${userId}`);
      const data = response.data;
      setChannels(data);
      
    } catch (error) {
      console.log("error", error);
    }
  };
  // console.log("channels am into",channels)

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        `https://ecoserver.vercel.app/api/user/chats`,
        { params: { userId } }
      );
      const messages = response.data;
      // console.log("Fetched messages:", messages); // Check fetched data structure

      // Toast.show({
      //   type: ALERT_TYPE.SUCCESS,
      //   title: `Chats collected`,
      // });

      // Process messages to store the latest message per unique recipient
      const uniqueChats = {};
      messages.forEach((msg) => {
        if (msg.sender && msg.recipient) {
          const otherUser =
            msg.sender._id === userId ? msg.recipient : msg.sender;

          // Keep only the latest message for each unique recipient
          if (
            !uniqueChats[otherUser._id] ||
            new Date(msg.timestamp) >
              new Date(uniqueChats[otherUser._id].timestamp)
          ) {
            uniqueChats[otherUser._id] = {
              id: otherUser._id,
              name: `${otherUser.firstName} ${otherUser.lastName}`,
              companyName: otherUser.companyName,
              message: msg.content,
              timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          }
        }
      });

      const chatListData = Object.values(uniqueChats).filter((chat) => chat); // Remove any undefined values
      // console.log("Processed chatList data:", chatListData); // Check processed chat list
      setChatList(chatListData); // Set unique chats with latest message
    } catch (error) {
      console.error("Failed to fetch chats:", error.message);
    }
  };

  const RenderChat = ({ chat }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ChatRoom", {
          companyName: chat?.companyName,
          companyId: chat?.id,
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
      }}
    >
      <View
        style={{ width: "20%", justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#e2e8f0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, color: "#475569" }}>
            {chat?.companyName?.charAt(0)}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "80%",
          paddingRight: 16,
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "500" }}>
            {chat?.companyName}
          </Text>
          <Text style={{ color: "#94a3b8", fontSize: 14 }}>
            {chat?.message.length > 16
              ? chat.message.slice(0, 16) + "..."
              : chat?.message}
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: "#94a3b8" }}>
          {chat?.timestamp}
        </Text>
      </View>
    </TouchableOpacity>
  );
  const RenderChannel = ({ channel }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ChannelChatRoom", {
          companyName: channel?.name,
          companyId: channel?._id,
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
      }}
    >
      <View
        style={{ width: "20%", justifyContent: "center", alignItems: "center" }}
      >
        <View
        className="border border-1 border-slate-700"
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#e2e8f0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, color: "#475569" }}>
            {channel?.name?.charAt(0)}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "80%",
          paddingRight: 16,
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "500" }}>
            {channel?.name}
          </Text>
          {/* <Text style={{ color: "#94a3b8", fontSize: 14 }}>
            {chat?.message.length > 16
              ? chat.message.slice(0, 16) + "..."
              : chat?.message}
          </Text> */}
        </View>
        <Text style={{ fontSize: 12, color: "#94a3b8" }}>
          {/* {chat?.timestamp} */}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "600" }}>Channels</Text>
        <View style={{ flexDirection: "row", alignItems: "center", space: 8 }}>
          <Pressable
            onPress={() => fetchChannels()}
            style={{
              backgroundColor: "black",
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Icon name="plus" size={25} color="white" />
          </Pressable>
          <Icon name="menu" size={25} />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search Supplier Name"
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: "#cbd5e1",
            borderRadius: 20,
            paddingHorizontal: 12,
          }}
        />
      </View>
      

      
      <View>
      <FlatList
          data={channels}
          renderItem={({ item }) => <RenderChannel channel={item} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No channels available
            </Text>
          }
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChannelsScreen;
