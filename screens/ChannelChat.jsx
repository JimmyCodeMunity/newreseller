import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../config";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const ChannelChatRoom = ({ navigation, route }) => {
  const { channelName, channelId } = route.params;
  const { userdata } = useContext(AuthContext);
  const userId = userdata?.userdata?._id;
  const { socket } = useSocketContext();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const scrollViewRef = useRef();

  useEffect(() => {
    loadSavedMessages();
    getMessages();
  }, []);

  useLayoutEffect(() => {
    return navigation.setOptions({
      headerTitle: channelName,
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={30} color="black" />
        </Pressable>
      ),
    });
  });

  const loadSavedMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(`messages_${channelId}`);
      if (savedMessages) {
        setMessages(
          JSON.parse(savedMessages).sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        );
      }
    } catch (error) {
      console.error("Failed to load the saved messages", error.message);
    }
  };

  const saveMessages = async (messages) => {
    try {
      await AsyncStorage.setItem(
        `messages_${channelId}`,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error("Failed to save messages", error.message);
    }
  };

  const getMessages = async () => {
    try {
      const response = await axios.get(
        `https://ecoserver.vercel.app/api/user/get-channel-messages/${channelId}`
      );
      // console.log("channel messages", response.data);

      const formattedMessages = response.data.messages.map((msg) => ({
        _id: msg._id,
        text: msg.content,
        createdAt: new Date(msg.timeStamp || msg.timestamp), // Ensure the date is properly parsed
        user: msg.sender?._id === userId ? "user" : "company", // Check if sender exists, then compare with userId
        type: msg.messageType,
      }));

      const sortedMessages = formattedMessages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setMessages(sortedMessages);
      saveMessages(sortedMessages);
    } catch (error) {
      console.error("Failed to get messages", error.message);
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (messageData) => {
      if (messageData.channelId === channelId) {
        const newMessage = {
          _id: messageData._id || Date.now().toString(),
          text: messageData.content || messageData.message,
          createdAt: new Date(messageData.timeStamp || messageData.timestamp),
          user: messageData.sender === userId ? "user" : "company",
          type: messageData.messageType || "text",
        };

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, newMessage].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          saveMessages(updatedMessages);
          return updatedMessages;
        });

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "New Message",
          textBody: "You have a new message",
        });

        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    };

    socket?.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket?.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, userId, channelId]);

  const sendChannelMessage = () => {
    if (!messageText.trim()) return;
    const newMessage = {
      _id: Date.now().toString(),
      text: messageText,
      createdAt: new Date(),
      user: "user",
      type: "text",
    };

    socket.emit("send-channel-message", {
      channelId: channelId,
      sender: userId,
      content: messageText,
      messageType: "text",
    });

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      saveMessages(updatedMessages);
      return updatedMessages;
    });

    setMessageText("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 90}
    >
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        className="mt-5"
        style={styles.messagesContainer}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message) => (
          <View
            key={message._id}
            style={[
              styles.messageWrapper,
              message.user === "user"
                ? styles.userMessage
                : styles.companyMessage,
            ]}
          >
            <View
              style={
                message.user === "user"
                  ? styles.userBubble
                  : styles.companyBubble
              }

              className={`${message.user === "user" ? 'bg-black':'bg-orange-500'}`}
            >
              <Text
                style={
                  message.user === "user" ? styles.userText : styles.companyText
                }
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View
        className="px-4 py-2"
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            style={styles.textInput}
          />
          <Pressable style={styles.sendButton} onPress={sendChannelMessage}>
            <Icon name="send" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChannelChatRoom;

const styles = StyleSheet.create({
  messagesContainer: { flex: 1, paddingHorizontal: 16 },
  messageWrapper: { width: "100%", marginBottom: 8 },
  userMessage: { alignItems: "flex-start" },
  companyMessage: { alignItems: "flex-end" },
  userBubble: {padding: 12, borderRadius: 8 },
  companyBubble: { padding: 12, borderRadius: 8 },
  userText: { color: "white" },
  companyText: { color: "white" },
  inputContainer: { borderColor: "gray" },
  inputWrapper: { flexDirection: "row", alignItems: "center" },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "orange",
    padding: 8,
    borderRadius: 50,
  },
});
