import React from "react";
import { ScrollView, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Background from "./components/Background.js";
import { AppText, styles as appTextStyles } from "./components/AppText.js";
import DeviceBox from "./components/DeviceBox.js";

const DPage = () => {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={{ flex: 1 }}>
      <Background />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 10, 
        }}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={appTextStyles.text1}>딸깍</AppText>
        <AppText style={appTextStyles.text2}>쉽고 편한 기기관리</AppText>
        <AppText style={appTextStyles.text3}>My Devices</AppText>
        <AppText style={appTextStyles.text4}>내 기기 My Devices</AppText>
        <DeviceBox />
      </ScrollView>
    </View>
  );
};

export default DPage;
