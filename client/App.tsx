import React from "react";
import { View } from "react-native";
import Background from "./src/screens/DevicePage/components/Background.js"; // 배경 컴포넌트 불러오기

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <Background />  
    </View>
  );
};

export default App;
