import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, TouchableOpacity, FlatList, Text, Alert,
} from 'react-native';
import Background from "./components/Background";
import { AppText, styles as appTextStyles } from "./components/AppText";
import { TriggerList } from "./components/TriggerList";
import { TriggerDeviceBox } from "./components/TriggerDeviceBox";
import {
  fetchTriggerDevices,
  fetchTriggerLists,
  activateDeviceBox,
  deactivateDeviceBox as deactivateDeviceBoxApi,
  changeDeviceName,
  changeListName,
  deleteDevice,
} from "../../api/triggerApi";

const TPage = () => {
  const [lists, setLists] = useState([]); // 목록 이름들
  const [selectedIndex, setSelectedIndex] = useState(0); // 현재 선택된 목록 인덱스
  const [deviceSets, setDeviceSets] = useState([]); // 각 목록별 디바이스 상태
  const [editingListIndex, setEditingListIndex] = useState(null); // 목록 이름 편집 인덱스
  const [editingDeviceIndex, setEditingDeviceIndex] = useState(null); // 디바이스 이름 편집 인덱스
  const [longPressedIndex, setLongPressedIndex] = useState(null); // 목록 꾹 누름 인덱스
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null); // 삭제 확인용 인덱스
  const [listObjects, setListObjects] = useState([]); // 목록 전체 객체들 (id 포함)

  // 앱이 켜지면 목록과 디바이스 불러오기 <== 수정해야함
  useEffect(() => {
    const loadListsAndDevices = async () => {
      try {
        const listData = await fetchTriggerLists();
        console.log("목록 데이터:", listData);
        setLists(listData.map(item => item.name));
        setListObjects(listData);

        const allDeviceSets = await Promise.all(
          listData.map(async (list) => {
            const devices = await fetchTriggerDevices(list.id);
            console.log(`listId ${list.id}의 디바이스들:`, devices);
            
            if (!devices || devices.length === 0) {
              console.warn(` listId ${list.id}는 빈 배열입니다. 더미를 삽입합니다.`);
              return [
                {
                  name: '테스트 디바이스',
                  deviceId: `${list.id}`,
                  deviceType: 'dial_actuator',
                  status: false,
                },
              ];
            }

            return devices.map(device => ({
              name: device.id.deviceType,         
              deviceId: device.id.deviceId,        
              deviceType: device.id.deviceType,   
              status: device.status ?? false,
            }));
          })
        );
        console.log("전체 deviceSets:", allDeviceSets);
        setDeviceSets(allDeviceSets);
      } catch (error) {
        console.error("목록 및 디바이스 로딩 실패", error);
        Alert.alert("오류", "디바이스 로딩에 실패했습니다.");
      }
    };
    loadListsAndDevices();
  }, []);

  //디바이스 활성화
  const handleDeviceToggle = async (doorId, deviceId, deviceType) => {
    try {
      const numericDeviceId = Number(deviceId);
      console.log("보내는 값 확인:", {
        doorId,
        deviceId: numericDeviceId,
        deviceType
      });

      const response = await activateDeviceBox(doorId, numericDeviceId, deviceType);

      if (response.status === 200) {
        Alert.alert("성공", "디바이스가 활성화되었습니다");
      } else {
        Alert.alert("실패", "디바이스 활성화 요청 실패");
      }
    } catch (error) {
      console.error("디바이스 활성화 오류:", error.response?.data || error.message);
      Alert.alert("오류", "디바이스 활성화 중 문제가 발생했습니다.");
    }
  };

  //디바이스 비활성화
  const deactivateDeviceBox = async (doorId, deviceId, deviceType) => {
    try {
      const payload = { doorId, deviceId, deviceType };
      const response = await deactivateDeviceBoxApi(payload);
      if (response.status === 200) {
        Alert.alert("성공", "디바이스가 비활성화되었습니다.");
      }
    } catch (error) {
      console.error("디바이스 비활성화 실패:", error);
      Alert.alert("오류", "디바이스 비활성화 요청 실패");
    }
  };

  const handleListNameChange = async (newName, index) => {
    const originalName = lists[index];
    const listId = listObjects[index]?.id;
    try {
      await changeListName(listId, "button", newName);
      const updated = [...lists];
      updated[index] = newName;
      setLists(updated);
      setEditingListIndex(null);
    } catch (err) {
      console.error("목록 이름 변경 실패:", err);
      const updated = [...lists];
      updated[index] = originalName;
      setLists(updated);
      setEditingListIndex(null);
    }
  };

  const handleDeviceNameChange = async (newName, index) => {
    const device = deviceSets[selectedIndex]?.[index];
    const originalName = device.name;
    try {
      await changeDeviceName(device.deviceId, device.deviceType, newName); 
      const updatedSets = [...deviceSets];
      updatedSets[selectedIndex][index].name = newName;
      setDeviceSets(updatedSets);
      setEditingDeviceIndex(null);
    } catch (error) {
      console.error("디바이스 이름 변경 실패:", error);
      const updatedSets = [...deviceSets];
      updatedSets[selectedIndex][index].name = originalName;
      setDeviceSets(updatedSets);
      setEditingDeviceIndex(null);
    }
  };

  const handleDeleteRequest = (index) => setConfirmDeleteIndex(index);
// 목록 삭제 기능
  const confirmDelete = async () => {
    const indexToDelete = confirmDeleteIndex;
    const newLists = lists.filter((_, i) => i !== indexToDelete);
    const newDeviceSets = deviceSets.filter((_, i) => i !== indexToDelete);
    setLists(newLists);
    setDeviceSets(newDeviceSets);
    setSelectedIndex(prev => (prev === indexToDelete ? 0 : prev > indexToDelete ? prev - 1 : prev));
    setConfirmDeleteIndex(null);

    try {
      const listId = listObjects[indexToDelete]?.id;
      if (listId) {
        await deleteDevice({ type: "button", deviceId: listId });
      }
    } catch (err) {
      console.error("목록 삭제 실패:", err);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteIndex(null);
    setLongPressedIndex(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <Background />
      <AppText style={appTextStyles.text1}>TTALKKAG</AppText>
      <AppText style={appTextStyles.text3}>Trigger</AppText>
      <AppText style={appTextStyles.text2}>트리거 페이지</AppText>

      {/* 목록 */}
      <View style={{ height: 60, marginTop: 20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 35 }}>
          {lists.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedIndex(index)} activeOpacity={1}>
              <TriggerList
                text={item}
                isSelected={selectedIndex === index}
                isEditing={editingListIndex === index}
                onEditPress={() => setEditingListIndex(index)}
                onNameChange={(newName) => {
                  const updated = [...lists];
                  updated[index] = newName;
                  setLists(updated);
                }}
                onSubmit={(finalName) => handleListNameChange(finalName.slice(0, 10), index)}
                onLongPress={() => setLongPressedIndex(index)}
                showDelete={longPressedIndex === index}
                onDeleteRequest={() => handleDeleteRequest(index)}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 삭제 확인 창 */}
      {confirmDeleteIndex !== null && (
        <View style={{ position: 'absolute', top: '40%', left: '20%', right: '20%', backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 10 }}>
          <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>정말 삭제하시겠습니까?</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={confirmDelete}><Text style={{ fontSize: 18, color: 'red' }}>O</Text></TouchableOpacity>
            <TouchableOpacity onPress={cancelDelete}><Text style={{ fontSize: 18 }}>X</Text></TouchableOpacity>
          </View>
        </View>
      )}

      {/* 디바이스 박스 */}
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: 'center', marginTop: 5, color: 'gray' }}>
          디바이스 수: {deviceSets[selectedIndex]?.length || 0}
        </Text>
        <FlatList
          data={deviceSets.length > 0 ? deviceSets[selectedIndex] || [] : []}
          renderItem={({ item, index }) => (
            <TriggerDeviceBox
              item={item}
              index={index}
              onToggle={() => {
                const doorId = listObjects[selectedIndex]?.id;
                if (!doorId) return;
                item.status
                  ? deactivateDeviceBox(doorId, item.deviceId, item.deviceType)   // 여기 type → deviceType 수정
                  : handleDeviceToggle(doorId, item.deviceId, item.deviceType);  // 여기 type → deviceType 수정
              }}
              isEditing={editingDeviceIndex === index}
              onEditStart={() => setEditingDeviceIndex(index)}
              onNameChange={(newName) => {
                const updatedSets = [...deviceSets];
                updatedSets[selectedIndex][index].name = newName;
                setDeviceSets(updatedSets);
              }}
              onSubmit={(finalName) => handleDeviceNameChange(finalName.slice(0, 10), index)}
            />
          )}
          keyExtractor={(item) => item.deviceId.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default TPage;
