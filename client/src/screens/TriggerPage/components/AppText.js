import React from "react";
import { Text, StyleSheet } from "react-native";

const AppText = ({ children, style }) => {
  return <Text style={[styles.default, style]}>{children}</Text>;
};


const styles = StyleSheet.create({
  default: {
    color: "#000",
  },
  text1: {
    fontWeight: "900",
    fontSize: 16,
    marginTop: 30, 
    marginLeft: 40,
  },
  text2: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 5,
    marginLeft: 40,
  },
  text3: {
    fontSize: 40,
    fontWeight: "700",
    marginTop: 30,
    marginLeft: 40,
  },
  text4: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 50,
    marginBottom: -10,
    marginLeft: 40,
    color: "#4999BA"
  },
});

export { AppText, styles };
