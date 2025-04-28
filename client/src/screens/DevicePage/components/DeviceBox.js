import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const DeviceBox = () => {
  const [expanded, setExpanded] = useState(false);
  const [isOn, setIsOn] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.innerBox, expanded && styles.innerBoxExpanded]}>
        {/* 토글*/}
        <TouchableOpacity
          style={styles.chevronBtn}
          onPress={() => setExpanded(e => !e)}
        >
          <Text style={styles.chevron}>{expanded ? "▼" : "▶"}</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          {/* 디바이스 아이콘 */}
          <Image
            source={require('../../../../assets/device_icon.png')}
            style={styles.deviceIcon}
            resizeMode="contain"
          />
          {/* 가운데 텍스트 */}
          <View style={styles.textArea}>
            <Text style={styles.deviceTitle}>전기장판</Text>
          </View>
          {/* 전원 버튼 */}
          <TouchableOpacity onPress={() => setIsOn(prev => !prev)} activeOpacity={0.8}>
            <Image
              source={
                isOn
                  ? require('../../../../assets/power_on.png')
                  : require('../../../../assets/power_off.png')
              }
              style={styles.powerBtn}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      {expanded && (
        <View style={styles.expandedBox}>
          {/* 확장 영역 내용 */}
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
    position: "relative",
  },
  chevronBtn: {
    position: "absolute",
    top: 2,
    right: 5,
    zIndex: 10,
    padding: 6,
  },
  chevron: {
    fontSize: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    height: "100%",
  },
  deviceIcon: {
    width: 80,
    height: 80,
    marginLeft: 10,
  },
  textArea: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 15,
  },
  deviceTitle: {
    fontWeight: "800",
    fontSize: 20,
    color: "#000",
    marginBottom: 30,
  },
  powerBtn: {
    width: 70,
    height: 70,
    marginLeft: 10,
  },
  innerBoxExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
