import React from "react";
import { View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const BackgroundGradient = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* 첫 번째 Gradient (대각선 방향) */}
      <LinearGradient
        style={{ position: "absolute", width: "100%", height: "100%" }}
        colors={["rgba(11, 151, 221, 0.7)", "rgba(99, 224, 182, 0.7)", "#f0f0f0"]}
        locations={[0, 0.25, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* 두 번째 Gradient (위에서 아래 방향) */}
      <LinearGradient
        style={{ position: "absolute", width: "100%", height: "100%" }}
        colors={[
          "rgba(240, 240, 240, 0)",
          "rgba(240, 240, 240, 0.7)",
          "#f0f0f0",
        ]}
        locations={[0, 0.4, 1]}
      />
    </View>
  );
};

export default BackgroundGradient;
