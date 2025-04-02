import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import Background from "./components/Background.js";
import { AppText, styles as appTextStyles } from "./components/AppText.js";

const DPage = () => {
  return (
    <View style={{ flex: 1 }}>
      <Background />
      <ScrollView>
        <View>
          <AppText style={appTextStyles.text1}>딸깍</AppText>
          <AppText style={appTextStyles.text2}>쉽고 편한 기기관리</AppText>
          <AppText style={appTextStyles.text3}>My Devices</AppText>
          <AppText style={appTextStyles.text4}>내 기기 My Devices</AppText>
        </View>
      </ScrollView>
    </View>
  );
};

export default DPage;
