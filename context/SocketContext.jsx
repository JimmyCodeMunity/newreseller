import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userdata, authUser } = useContext(AuthContext);
  const userId = userdata?.userdata?._id;
  console.log("useridis",userId)

  if(userId) {
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: `Welcome Back ${userdata?.userdata?.firstName}`,
    })
  }

  useEffect(() => {
    if (authUser) {
      const socket = io(SOCKET_URL, {
        query: { userId },
      });
      setSocket(socket);

      return () => socket.close();
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [authUser, userId]); // Include userId and authUser as dependencies

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
