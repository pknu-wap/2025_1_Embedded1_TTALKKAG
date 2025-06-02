import React, { useState, useEffect } from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Image } from "react-native";
import DevicePage from "./src/screens/DevicePage";
import TriggerPage from "./src/screens/TriggerPage";
import Loading from "./src/screens/LoadingPage";
import { registerDevice } from './src/api/deviceApi';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);

  // 앱 로드 시 registerDevice 호출
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 기기 등록 요청
        const response = await registerDevice();
        // 기기 등록이 끝나면 로딩 화면을 종료하고, 메인 화면으로 넘어감
        console.log("기기 등록 성공:", response.data);

        setLoading(false);
      } catch (error) {
        console.error("기기 등록 실패:", error);
        setLoading(false);  // 실패하더라도 로딩을 종료
      }
    };
    initializeApp();
  }, []); 

  // if (loading) return <Loading />; // 로딩 화면이 끝나기 전까지 로딩 컴포넌트 표시

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="디바이스 목록 페이지"
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
            tabBarActiveTintColor: "#fff",
            tabBarInactiveTintColor: "#888",
          }}
        >
          <Tab.Screen
            name="디바이스 목록 페이지"
            component={DevicePage}
            options={{
              tabBarLabel: "Device",
              tabBarIcon: ({ focused}) => (
                <Image
                  source={require("./assets/DeviceNav.png")}
                  style={{
                    width: 32,
                    height: 32,
                    tintColor: focused ? "#fff" : "#888",
                    marginTop: 15
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="트리거 목록 페이지"
            children={({ navigation }) => <TriggerPage navigation={navigation} />}
            options={{
              tabBarLabel: "Trigger",
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("./assets/TriggerNav.png")}
                  style={{
                    width: 28,
                    height: 28,
                    tintColor: focused ? "#fff" : "#888",
                    marginTop: 15
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 60,
    backgroundColor: "#000",
    position: "absolute",
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8
  },
  
});

export default App;
