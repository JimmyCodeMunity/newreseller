import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
  Platform,
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
  const [filteredChannels, setFilteredChannels] = useState([]);

  useEffect(() => {
    fetchChats();
    fetchChannels();
  }, []);

  // Listen for any new chat
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
      const response = await axios.get(`https://ecoserver.vercel.app/api/user/get-channels/${userId}`);
      const data = response.data;
      console.log("thuis convo",data)
      setChannels(data);
      setFilteredChannels(data); // Set initial filtered data to all channels
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        `https://ecoserver.vercel.app/api/user/chats`,
        { params: { userId } }
      );
      const messages = response.data;
      const uniqueChats = {};

      messages.forEach((msg) => {
        if (msg.sender && msg.recipient) {
          const otherUser =
            msg.sender._id === userId ? msg.recipient : msg.sender;

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

      const chatListData = Object.values(uniqueChats).filter((chat) => chat);
      setChatList(chatListData);
    } catch (error) {
      console.error("Failed to fetch chats:", error.message);
    }
  };

  // Real-time search filter
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredChannels(channels);
    } else {
      const filtered = channels.filter((channel) =>
        channel.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredChannels(filtered);
    }
  }, [search, channels]);

  const RenderChannel = ({ channel }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ChannelChatRoom", {
          channelName: channel?.name,
          channelId: channel?._id,
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
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        className={`${Platform.OS === "android" ? "mt-12" : "mt-8"}`}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ fontSize: 30 }} className="font-bold text-neutral-700">
          Channels
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search Channel Name"
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
          data={filteredChannels}
          renderItem={({ item }) => <RenderChannel channel={item} />}
          keyExtractor={(item) => item._id}
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
