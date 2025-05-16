import React from "react";
import { Text, StyleSheet, View } from "react-native";

const TriggerList = ({ children, style, textStyle }) => {
  return (
    <View style={style}>
      <Text style={textStyle}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  baseItem: {
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 50,
    borderWidth: 0,
    borderColor: "rgba(0, 0, 0, 0.1)",
    width: 110,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  selectedListItem: {
    backgroundColor: "#F3F8F7",
    elevation: 7,
  },
  listText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
});

export { TriggerList, styles };
