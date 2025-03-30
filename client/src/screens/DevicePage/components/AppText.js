import React from "react";
import { Text, StyleSheet } from "react-native";

const AppText = ({children, style}) => {
  return <Text style={[styles.default, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  default: {
    color: "#000",
    textAlign: "center",
    position: "absolute",
  },
  text1: {
    top: 53,
    left: 40,
    fontWeight: "800",
    fontSize: 20,
    lineHeight: 28
  },
  text2: {
    top: 105,
    left: 40,
    fontSize: 20,
    fontWeight: "300",
  },
  text3: {
    top: 135,
    left: 40,
    fontSize: 40,
  },
  text4: {
    top: 250,
    left: 40,
    fontSize: 20,
    fontWeight: "800",
  },
});

export { AppText, styles };