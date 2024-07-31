import React, { useEffect, useState } from "react";
import { SafeAreaView,TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import axios from 'axios'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';




//firebase authentication setup
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { initializeApp } from 'firebase/app';


import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
  Alert,
  Dimensions
} from "react-native";




const ResetPassword = ({ navigation, route }) => {
  const { email } = route.params;
  const [animationLoaded, setAnimationLoaded] = useState(false);
  //const [name, setUsername] = useState("");
  const [userdata, setUserdata] = useState({});

  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');


  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    getUserdata();
  }, []);

  const getUserdata = () => {
    fetch('https://res-server-sigma.vercel.app/api/user/usersdata')
      .then((response) => response.json())
      .then((data) => {
        const user = data.find((item) => item.email === email);
        if (user) {
          setUserdata(user);
          setPassword(user.password);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatePassword = async () => {
    if (password != cpassword) {
      alert("password do not match")
    } else {
      try {
        const response = await axios.put(`https://res-server-sigma.vercel.app/api/user/updatepassword/${email}`, {
          password: password
        });
        setUserdata(response.data);
        alert('Password reset successful');
      } catch (error) {
        console.log(error);
        alert("Failed")
      }
    };
  }

  const handleLogin = () => {
    // Perform login logic here
    navigation.navigate("Login");
  };



  useEffect(() => {
    // Simulate a delay for the splash screen (optional)
    setTimeout(() => {
      setAnimationLoaded(true);
      // Navigate to the main screen or any other screen after the splash screen
      // Replace 'MainScreen' with your desired screen component
      // navigation.navigate('MainScreen');
    }, 6000); // Delay in milliseconds (adjust as needed)
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-1 bg-white px-5">
        <View className="absolute" style={{ top: 30, right: 20 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} className=" bg-orange-400 h-12 w-12 rounded-3xl justify-center items-center" >
            <Icon name="arrow-left" color="white" size={30} />
          </TouchableOpacity>
        </View>


        <View className="mt-12">
          <Image source={require('../assets/images/resellersplash.png')} className="h-16 w-16" />
        </View>

        <View className="mt-12">
          <View className="py-5">
            <TextInput
              className="h-12 w-90 bg-slate-200 rounded-2xl px-4"
              placeholder="enter new password"
              onChangeText={(text) => setPassword(text)}
              placeholderTextColor={'gray'}
              secureTextEntry
            />
          </View>
          <View className="py-5">
            <TextInput
              className="h-12 w-90 bg-slate-200 rounded-2xl px-4"
              placeholder="Confirm new password"
              onChangeText={(text) => setCPassword(text)}
              placeholderTextColor={'gray'}
              secureTextEntry
            />
          </View>

          <View className="justify-center items-center mt-5">
            <TouchableOpacity onPress={updatePassword} className="bg-orange-400 justify-center rounded-2xl shadow-lg shadow-slate-200 items-center h-12 w-80">
              <Text className="font-bold text-white text-2xl">Reset</Text>
            </TouchableOpacity>
          </View>
        </View>


      </View>


      <View className="justify-center items-center w-full px-4 absolute" style={{ bottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-black w-60 h-12 justify-center items-center rounded-2xl ">
          <Text className="text-white font-semibold text-lg">Remembered my password?</Text>
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logocontainer: {
    height: "70%",
    backgroundColor: "orange",
    borderBottomStartRadius: 60,
    borderBottomEndRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "-5%",
  },
  logotext: {
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 27,
    paddingVertical: 12,
  },
  form: {
    backgroundColor: "#ffffff",
    width: "80%",
    height: "90%",
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginTop: '10%',

  },
  input: {
    backgroundColor: "white",
    width: "80%",
    borderBottomColor: "#ccc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    paddingVertical: 12,
    borderWidth: 0.4,
    borderColor: 'orange'
  },
  logo: {
    marginTop: "50%",
  },
  btn: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'orange',
    borderRadius: 9,
    width: 200,
    alignItems: 'center',
    padding: 12,
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 20,

  },
  btncontainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntext: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20,
  }
});

export default ResetPassword;