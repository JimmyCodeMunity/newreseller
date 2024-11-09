import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from "react";
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

const ChatRoom = ({ navigation, route }) => {
  const { companyName,companyId } = route.params;
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
              <Text className="text-xl font-semibold">
                {companyName}
              </Text>
            </View>
          </View>
        );
      },
    });
  });

  // Load saved messages from AsyncStorage
  const loadSavedMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(`messages_${companyId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      }
    } catch (error) {
      console.error("Failed to load the saved messages", error.message);
    }
  };

  const saveMessages = async (messages) => {
    try {
      await AsyncStorage.setItem(`messages_${companyId}`, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages", error.message);
    }
  };

  // Fetch messages from server
  const getMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getmessages`, {
        params: { sender: userId, recipient: companyId },
      });
      const formattedMessages = response.data.map((msg) => ({
        _id: msg._id,
        text: msg.content,
        createdAt: new Date(msg.timeStamp),
        user: msg.sender === userId ? "user" : "company",
        type: msg.messageType,
      }));

      const sortedMessages = formattedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(sortedMessages);
      saveMessages(sortedMessages);
    } catch (error) {
      console.error("Failed to get messages", error.message);
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (messageData) => {
      // Check if the message is relevant to this chat
      if (
        (messageData.sender === companyId && messageData.recipient === userId) ||
        (messageData.sender === userId && messageData.recipient === companyId)
      ) {
        // Prevent adding the same message twice for the sender
        if (messageData.sender === userId) return;

        const newMessage = {
          _id: messageData._id || Date.now().toString(),
          text: messageData.content || messageData.message,
          createdAt: new Date(messageData.timeStamp || messageData.timestamp),
          user: messageData.sender === userId ? "user" : "company",
          type: messageData.messageType || "text",
        };
  
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, newMessage].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          saveMessages(updatedMessages);
          return updatedMessages;
        });

        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    };
  
    socket?.on("receiveMessage", handleReceiveMessage);
  
    return () => {
      socket?.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, userId, companyId]);

  // Send message
  const sendMessage = () => {
    if (!messageText.trim()) return;
    const newMessage = {
      _id: Date.now().toString(),
      text: messageText,
      createdAt: new Date(),
      user: "user", // Mark as user message
      type: "text",
    };

    // Emit the message through the socket without adding it to the state directly
    socket.emit("sendMessage", {
      sender: userId,
      recipient: companyId,
      content: messageText,
      messageType: "text",
    });

    // Add the message to the state directly for instant display
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      saveMessages(updatedMessages);
      return updatedMessages;
    });

    setMessageText("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        className="py-2"
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
        style={styles.messagesContainer}
      >
        {messages.map((message) => (
          <View
            key={message._id}
            style={[
              styles.messageWrapper,
              message.user !== "user" ? styles.userMessage : styles.companyMessage,
            ]}
          >
            <View className={`${message.user === "user" ? 'bg-black rounded-tl-md rounded-tr-md rounded-br-md':'bg-orange-500 text-white border border-1 border-orange-200 rounded-tl-md rounded-tr-md rounded-bl-md'} px-3 py-2 px-2`}
            //  style={message.user === "user" ? styles.userBubble : styles.companyBubble}
             >
              <Text style={message.user === "user" ? styles.userText : styles.companyText}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            style={styles.textInput}
          />
          <Pressable style={styles.sendButton} onPress={sendMessage}>
            <Icon name="send" size={20} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  messagesContainer: { flex: 1, paddingHorizontal: 16 },
  messageWrapper: { width: "100%", marginBottom: 8 },
  userMessage: { alignItems: "flex-end" },
  companyMessage: { alignItems: "flex-start" },
  userBubble: { backgroundColor: "black", padding: 12, borderRadius: 8 },
  companyBubble: { backgroundColor: "gray", padding: 12, borderRadius: 8 },
  userText: { color: "white" },
  companyText: { color: "white" },
  inputContainer: { borderTopWidth: 1, borderColor: "gray", padding: 12 },
  inputWrapper: { flexDirection: "row", alignItems: "center" },
  textInput: { flex: 1, height: 40, borderWidth: 1, borderColor: "gray", borderRadius: 20, paddingHorizontal: 10 },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "orange",
    padding: 8,
    borderRadius: 50,
  },
});
