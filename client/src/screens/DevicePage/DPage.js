import React, { useEffect, useState } from "react";
import { ScrollView, View,RefreshControl } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Background from "./components/Background.js";
import { AppText, styles as appTextStyles } from "./components/AppText.js";
import DeviceBox from "./components/DeviceBox.js";
import { fetchDeviceList } from "../../api/deviceApi"; 



const DPage = () => {
  const tabBarHeight = useBottomTabBarHeight(); // 하단 탭바 높이를 가져와서 ScrollView 패딩에 반영
  const [deviceList, setDeviceList] = useState([]); // 기기 목록을 저장할 state
  const [refreshing, setRefreshing] = useState(false);
  // 기기 목록 불러오는
  const loadDevices = async () => {
    try {
      const response = await fetchDeviceList();  // 서버로부터 기기목록 요청
      console.log("기기 목록 로드 성공:", response.data);
      // buttons와 dials를 하나의 배열로 합쳐 저장 (각 항목에 type 속성 추가)
      // DeviceBox에서 type에 따라 다른 UI를 구성할 수 있게 하기 위함
      // setDeviceList([
      //   ...response.data.buttons.map((b) => ({ ...b, type: "button_clicker" })),
      //   ...response.data.dials.map((d) => ({ ...d, type: "dial_actuator" }))
      // ]);
      // 테스트용 더미
      setDeviceList([
        { id: 1, name: "다이얼 1", memo: "", type: "dial_actuator" },
        { id: 2, name: "다이얼 2", memo: "", type: "dial_actuator" },
        { id: 3, name: "다이얼 3", memo: "", type: "dial_actuator" },
        { id: 4, name: "다이얼 4", memo: "", type: "dial_actuator" },
        { id: 5, name: "다이얼 4", memo: "", type: "dial_actuator" },
        { id: 6, name: "다이얼 4", memo: "", type: "dial_actuator" },

      

      ]);
    } catch (error) {
        console.log(error.message);
      }
  };
  
  // 삭제된 기기를 화면에서 제거하는 함수
  const handleDeviceDelete = (id, type) => {
    // 1. 목록에서 즉시 제거
    setDeviceList((prevList) => prevList.filter((device) => !(device.id === id && device.type === type)));
    // 2. 서버와 동기화 위해 목록 새로고침 
    loadDevices();
  };
  
  const handleDeviceMemoUpdate = (id, type, newMemo) => {
    setDeviceList((prevList) =>
      prevList.map((device) =>
        device.id === id && device.type === type
          ? { ...device, memo: newMemo }
          : device
      )
    );
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await loadDevices();
    setRefreshing(false);
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
           refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4999BA"]}
          />
        }
      >
        <AppText style={appTextStyles.text1}>TTALKKACK</AppText>
        <AppText style={appTextStyles.text3}>Device</AppText>
        <AppText style={appTextStyles.text2}>디바이스 페이지</AppText>
        <AppText style={appTextStyles.text4}>내 기기 My Devices</AppText>

        {/* 기기 목록을 map으로 순회하여 DeviceBox 컴포넌트로 렌더링 */}
        {deviceList.map((device) => (
          <DeviceBox
            key={`${device.type}-${device.id}`} // key 가 고유하게 타입-1,2,3
            id={device.id}
            name={device.name}
            type={device.type} // button 또는 dial
            memo={device.memo}
            onDelete={handleDeviceDelete} 
            onUpdateMemo={handleDeviceMemoUpdate} 
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default DPage;
