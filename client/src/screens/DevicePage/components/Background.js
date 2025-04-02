import React from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const Background = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradient}
        colors={["rgba(11, 151, 221, 0.7)", "rgba(99, 224, 182, 0.7)", "#f0f0f0"]}
        locations={[0, 0.25, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <LinearGradient
        style={styles.gradient}
        colors={["rgba(240, 240, 240, 0)", "rgba(240, 240, 240, 0.7)", "#f0f0f0"]}
        locations={[0, 0.4, 1]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject    // 화면 전체덮을려고 스크롤할때 배경 짤리기방지
  },
  gradient: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

export default Background;
