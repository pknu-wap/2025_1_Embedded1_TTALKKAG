import React from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View,StyleSheet} from "react-native";
import DevicePage from "./src/screens/DevicePage"; 

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="디바이스 목록 페이지"
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarActiveTintColor: "#fff",
          tabBarIcon: () => null,
          tabBarBackground: () => (
              <View style={styles.divider} />
          ),
        }}
      >
        <Tab.Screen name="디바이스 목록 페이지" component={DevicePage} />
        {/* <Tab.Screen name="트리거 목록 페이지" component={TriggerPage} /> */}
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
    fontSize: 17, 
    fontWeight: "bold",
  },
  divider: {
    position: "absolute",
    width: 1.5,
    height: 90, 
    backgroundColor: "#fff", 
    left: "50%",
  },
});

export default App;
