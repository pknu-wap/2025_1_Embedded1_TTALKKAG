import React, { useState, useEffect } from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Image } from "react-native";
import DevicePage from "./src/screens/DevicePage";
import AnotherPage from "./src/screens/DevicePage/AnotherPage";
import Loading from "./src/screens/LoadingPage";

const Tab = createBottomTabNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

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
    marginTop: 23, // 아이콘과 라벨 간격 조정
  },
});

export default App;
