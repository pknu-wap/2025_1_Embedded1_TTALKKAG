import React, { useState } from 'react';
import {
  ScrollView, View, TouchableOpacity, FlatList
} from 'react-native';
import Background from "./components/Background";
import { AppText, styles as appTextStyles } from "./components/AppText";
import { TriggerList } from "./components/TriggerList";
import { TriggerDeviceBox } from "./components/TriggerDeviceBox";

const lists = ['목록1', '목록2', '목록3', '목록4', '목록5'];

const initialDeviceSets = [
  [
    { name: '디바이스 1', status: false },
    { name: '디바이스 2', status: true },
    { name: '디바이스 3', status: false },
    { name: '디바이스 4', status: false },
    { name: '디바이스 5', status: false },
    { name: '디바이스 6', status: false },
    { name: '디바이스 7', status: false },
    { name: '디바이스 8', status: false },
  ],
  [
    { name: '디바이스 1', status: false },
    { name: '디바이스 2', status: false }
  ],
  [
    { name: '디바이스 11', status: false },
    { name: '디바이스 22', status: true },
    { name: '디바이스 33', status: false },
    { name: '디바이스 44', status: false }
  ],
  [
    { name: '디바이스 111', status: true }
  ],
  [
    { name: '디바이스 1111', status: false },
    { name: '디바이스 2222', status: false },
    { name: '디바이스 3333', status: false }
  ]
];

const TPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deviceSets, setDeviceSets] = useState(initialDeviceSets);

  const handleDeviceToggle = (deviceIndex) => {
    const updatedDevices = [...deviceSets];
    updatedDevices[selectedIndex][deviceIndex].status =
      !updatedDevices[selectedIndex][deviceIndex].status;
    setDeviceSets(updatedDevices);
    // TODO: 백엔드 전송
  };

  const renderDeviceBox = ({ item, index }) => (
    <TriggerDeviceBox
      item={item}
      index={index}
      onToggle={handleDeviceToggle}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <Background />
      <AppText style={appTextStyles.text1}>TTALKKAG</AppText>
      <AppText style={appTextStyles.text3}>Trigger</AppText>
      <AppText style={appTextStyles.text2}>트리거 페이지</AppText>

      {/* 목록 버튼 */}
      <View style={{ height: 60, marginTop: 55 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {lists.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedIndex(index)}>
              <TriggerList
                text={item}
                isSelected={selectedIndex === index}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 디바이스 박스 */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={deviceSets[selectedIndex]}
          renderItem={renderDeviceBox}
          keyExtractor={(_, i) => i.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default TPage;
