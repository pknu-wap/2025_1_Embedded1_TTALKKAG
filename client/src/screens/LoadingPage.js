import React from "react";
import { View, ImageBackground, ActivityIndicator, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const LoadingPage = () => (
  <ImageBackground
    source={require('../../assets/Loading.png')} 
    style={styles.background}
    resizeMode="cover" 
  >
    <View style={styles.overlay}>
    </View>
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    flex: 1, 
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoadingPage;
