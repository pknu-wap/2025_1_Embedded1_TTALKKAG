import React, { useState, useEffect } from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Image } from "react-native";
import DevicePage from "./src/screens/DevicePage";
import AnotherPage from "./src/screens/DevicePage/AnotherPage";
import Loading from "./src/screens/LoadingPage";
import { registerDevice } from './src/api/deviceApi';

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

  if (loading) return <Loading />; // 로딩 화면이 끝나기 전까지 로딩 컴포넌트 표시

  return (
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
            tabBarLabel: "Device Page",
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={require("./assets/DeviceNav.png")}
                style={{
                  width: 32,
                  height: 32,
                  tintColor: focused ? "#fff" : "#888",
                  marginBottom: 5,
                  marginTop: 45
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tab.Screen
          name="트리거 목록 페이지"
          component={AnotherPage}
          options={{
            tabBarLabel: "Trigger Page",
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={require("./assets/TriggerNav.png")}
                style={{
                  width: 32,
                  height: 32,
                  tintColor: focused ? "#fff" : "#888",
                  marginBottom: 5,
                  marginTop: 45
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 90,
    backgroundColor: "#000",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
  },
  tabBarLabelStyle: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 23, 
  },
});

export default App;
