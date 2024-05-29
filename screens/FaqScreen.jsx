import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import LottieView from 'lottie-react-native';

const FaqScreen = ({route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const link = "https://resellersprint.com/faq";

  useEffect(() => {
    checkInternetConnection();

    // Show loader for 2 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const checkInternetConnection = () => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isConnected ? (
        <View style={styles.connectionErrorContainer}>
          <Text style={styles.connectionErrorText}>No internet connection</Text>
        </View>
      ) : isLoading ? (
        <View style={styles.loaderContainer}>
          
          <Text>Please wait....</Text>
        </View>
      ) : (
        <WebView 
        // onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        source={{ uri: link }} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 200,
    height: 200,
  },
  connectionErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionErrorText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FaqScreen;