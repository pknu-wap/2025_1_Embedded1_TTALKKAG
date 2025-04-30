import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Background from "./components/Background.js";
import { AppText, styles as appTextStyles } from "./components/AppText.js";
import DeviceBox from "./components/DeviceBox.js";
import { fetchDeviceList } from "../../api/deviceApi"; 

const DPage = () => {
  const tabBarHeight = useBottomTabBarHeight(); // 하단 탭바 높이를 가져와서 ScrollView 패딩에 반영
  const [deviceList, setDeviceList] = useState([]); // 기기 목록을 저장할 state

  // 기기 목록 불러오는
  const loadDevices = async () => {
    try {
      const response = await fetchDeviceList();  // 서버로부터 기기목록 요청
      console.log("기기 목록 로드 성공:", response.data);
      // buttons와 dials를 하나의 배열로 합쳐 저장 (각 항목에 type 속성 추가)
      // DeviceBox에서 type에 따라 다른 UI를 구성할 수 있게 하기 위함
      setDeviceList([
        ...response.data.buttons.map((b) => ({ ...b, type: "button" })),
        ...response.data.dials.map((d) => ({ ...d, type: "dial" }))
      ]);
    } catch (error) {
        console.log(error.message);
      }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Background />
      {/* 기기 리스트를 스크롤 가능한 영역에 렌더링 탭바 가리지 않도록 하단 패딩 추가 */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + 10 }}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={appTextStyles.text1}>딸깍</AppText>
        <AppText style={appTextStyles.text2}>쉽고 편한 기기관리</AppText>
        <AppText style={appTextStyles.text3}>My Devices</AppText>
        <AppText style={appTextStyles.text4}>내 기기 My Devices</AppText>

        {/* 기기 목록을 map으로 순회하여 DeviceBox 컴포넌트로 렌더링 */}
        {deviceList.map((device) => (
          <DeviceBox
            key={device.id}
            id={device.id}
            name={device.name}
            type={device.type} // button 또는 dial
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default DPage;
