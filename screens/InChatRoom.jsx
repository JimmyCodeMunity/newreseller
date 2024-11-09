import React, { useState, useEffect, useContext, useRef } from "react";
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

const InChatRoom = ({ navigation, route }) => {
  const { companyName, companyId } = route.params;
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

  useEffect(() => {
    const handleReceiveMessage = (messageData) => {
      // Log the structure of messageData to understand its structure
      console.log("New message received:", messageData);
  
      // Check if the message is relevant to this chat
      if (
        (messageData.sender === companyId && messageData.recipient === userId) ||
        (messageData.sender === userId && messageData.recipient === companyId)
      ) {
        const formattedMessage = {
          _id: messageData._id || Date.now().toString(), // Ensure _id exists, use timestamp as fallback
          text: messageData.content || messageData.message, // Check for 'content' or 'message'
          createdAt: new Date(messageData.timeStamp || messageData.timestamp), // Handle 'timeStamp' or 'timestamp'
          user: messageData.sender === userId ? "user" : "company",
          type: messageData.messageType || "text", // Use default "text" if messageType is undefined
        };
  
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, formattedMessage];
          saveMessages(updatedMessages); // Save messages in AsyncStorage
          return updatedMessages;
        });
      }
    };
  
    // Listen for incoming messages
    socket?.on("receiveMessage", handleReceiveMessage);
  
    // Cleanup event listener on component unmount or dependency change
    return () => {
      socket?.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, userId, companyId]);
  

  // Load saved messages from AsyncStorage
  const loadSavedMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(`messages_${companyId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
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
      const filteredMessages = response.data.filter((msg) => msg.sender && msg.recipient);
      const formattedMessages = filteredMessages.map((msg) => ({
        _id: msg._id,
        text: msg.content,
        createdAt: new Date(msg.timeStamp),
        user: msg.sender === userId ? "user" : "company",
        type: msg.messageType,
      }));

      setMessages(formattedMessages);
      saveMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to get messages", error.message);
    }
  };

  // Send message
  const sendMessage = () => {
    if (!messageText.trim()) return;
    const newMessage = {
      _id: Date.now().toString(),
      text: messageText,
      sender: userId,
      messageType: "text",
      type: "UserMessage",
    };

    socket.emit("sendMessage", {
      sender: userId,
      recipient: companyId,
      content: messageText,
      messageType: "text",
      type: "UserMessage",
    });

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      saveMessages(updatedMessages);
      return updatedMessages;
    });
    setMessageText("");
  };

  return (
    <SafeAreaView className="py-4 flex-1">
      <ScrollView
        className="py-4"
        ref={scrollViewRef}
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
              message.user === "user" ? styles.userMessage : styles.companyMessage,
            ]}
          >
            <View style={message.user === "user" ? styles.userBubble : styles.companyBubble}>
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
            className="h-10 w-full flex-1 border border-1 border-slate-300 px-4 rounded-xl"
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
          />
          <Pressable style={styles.sendButton} onPress={sendMessage}>
            <Icon name="send" size={20} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InChatRoom;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  messagesContainer: { flex: 1, paddingHorizontal: 16 },
  messageWrapper: { width: "100%", marginBottom: 8 },
  userMessage: { alignItems: "flex-end" },
  companyMessage: { alignItems: "flex-start" },
  userBubble: { backgroundColor: "black", padding: 12, borderRadius: 8 },
  companyBubble: { backgroundColor: "gray", padding: 12, borderRadius: 8 },
  userText: { color: "white" },
  companyText: { color: "black" },
  inputContainer: { borderTopWidth: 1, borderColor: "gray", padding: 12 },
  inputWrapper: { flexDirection: "row", alignItems: "center" },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "orange",
    padding: 8,
    borderRadius: 50,
  },
});
