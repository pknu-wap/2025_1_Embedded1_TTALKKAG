import React from 'react';
import { View } from 'react-native';
import Background from "./components/Background.js";
import { AppText, styles as appTextStyles } from "./components/AppText.js";

const TPage = () => {

  return (
    <View style={{ flex: 1 }}>
      <Background />
      <AppText style={appTextStyles.text1}>TTALKKAG</AppText>
      <AppText style={appTextStyles.text3}>Trigger</AppText>
      <AppText style={appTextStyles.text2}>트리거 페이지</AppText>
    </View>
  );
};


export default TPage;
