import React from "react";
import { Text, StyleSheet } from "react-native";

const AppText = ({ children, style }) => {
  return <Text style={[styles.default, style]}>{children}</Text>;
};

// 절대 위치보다 margin으로 유동적이게 하는게 나을듯
const styles = StyleSheet.create({
  default: {
    color: "#000",
  },
  text1: {
    fontWeight: "800",
    fontSize: 24,
    marginTop: 55, 
    marginLeft: 40,
  },
  text2: {
    fontSize: 20,
    fontWeight: "300",
    marginTop: 30,
    marginLeft: 40,
  },
  text3: {
    fontSize: 40,
    fontWeight: "700",
    marginTop: 10,
    marginLeft: 40,
  },
  text4: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 40,
    marginLeft: 40,
  },
});

export { AppText, styles };
