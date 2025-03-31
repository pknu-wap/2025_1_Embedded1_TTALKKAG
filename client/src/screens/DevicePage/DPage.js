import React from "react";
import {View} from "react-native";
import Background from "./components/Background.js"; 
import {AppText, styles} from "./components/AppText.js"; 


const DPage = () => {
  return (
    <View style={{flex: 1}}>
      <Background />
      <View style={{ position: "absolute", flexDirection: "column"}}>
        <AppText style={styles.text1}>TTALKKAG</AppText>
        <AppText style={styles.text2}>쉽고 편한 기기관리</AppText>
        <AppText style={styles.text3}>My Devices</AppText>
        <AppText style={styles.text4}>내 기기 My Devices</AppText>
      </View>
    </View>
  );
};

export default DPage;
