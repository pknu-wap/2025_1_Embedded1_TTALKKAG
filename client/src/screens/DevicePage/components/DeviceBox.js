import React from "react";
import { View,StyleSheet, Dimensions} from "react-native";

const { width, height } = Dimensions.get("window");
const DeviceBox = () => {

  return (
    <View style={styles.innerShadowBox}>
    </View>
  );
};


const styles = StyleSheet.create({
  innerShadowBox: {
    width: width * 0.85, 
    height: height * 0.18, 
    backgroundColor: "white",
    backgroundColor: "white",
    borderRadius: 31,
    elevation: 10,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: width * 0.075,
  },
});

export default DeviceBox;
