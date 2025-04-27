import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const DeviceBox = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.innerBox, expanded && styles.innerBoxExpanded]}>
        <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text>전기장판</Text>
          <Text>메모를 입력하세요.</Text>
        </View>
          <View style={styles.rightIcons}>
            <TouchableOpacity
              style={{ marginLeft: 'auto'}} 
              onPress={() => setExpanded(e => !e)}
            >
              <Text style={styles.chevron}>{expanded ? "▼" : "▶"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {expanded && (
        <View style={styles.expandedBox}>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 20,
  },
  innerBox: {
    width: width * 0.85,
    height: height * 0.15,
    backgroundColor: "white",
    borderTopLeftRadius: 31,
    borderTopRightRadius: 31,
    borderBottomLeftRadius: 31,
    borderBottomRightRadius: 31,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
    zIndex: 2,
  },
  innerBoxExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  chevronBtn: {
    padding: 6,
  },
  chevron: {
    fontSize: 22,
    fontWeight: "bold",
  },
  expandedBox: {
    width: width * 0.85,
    height: height * 0.13,
    backgroundColor: "white",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    borderBottomLeftRadius: 31,
    borderBottomRightRadius: 31,
    zIndex: 1,
    justifyContent: "center",
  },
});

export default DeviceBox;
