import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
  Text,
  Alert,
  Pressable,
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
  const [lists, setLists] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deviceSets, setDeviceSets] = useState([]);
  const [editingListIndex, setEditingListIndex] = useState(null);
  const [editingDeviceIndex, setEditingDeviceIndex] = useState(null);
  const [longPressedIndex, setLongPressedIndex] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [listObjects, setListObjects] = useState([]);

  useEffect(() => {
    const loadListsAndDevices = async () => {
      try {
        const listData = await fetchTriggerLists();
        setLists(listData.map(item => item.name));
        setListObjects(listData);

        const allDeviceSets = await Promise.all(
          listData.map(async (list) => {
            const devices = await fetchTriggerDevices(list.id);
            if (!devices || devices.length === 0) {
              return [{
                name: '테스트 디바이스',
                deviceId: `${list.id}`,
                deviceType: 'dial_actuator',
                status: false,
              }];
            }
            return devices.map(device => ({
              name: device.id.deviceType,
              deviceId: device.id.deviceId,
              deviceType: device.id.deviceType,
              status: device.status ?? false,
            }));
          })
        );
        setDeviceSets(allDeviceSets);
      } catch (error) {
        console.error("목록 및 디바이스 로딩 실패", error);
        Alert.alert("오류", "디바이스 로딩에 실패했습니다.");
      }
    };
    loadListsAndDevices();
  }, []);

  const handleDeviceToggle = async (doorId, deviceId, deviceType) => {
    try {
      const response = await activateDeviceBox(doorId, Number(deviceId), deviceType);
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

  const confirmDelete = async () => {
    const indexToDelete = confirmDeleteIndex;
    const newLists = lists.filter((_, i) => i !== indexToDelete);
    const newDeviceSets = deviceSets.filter((_, i) => i !== indexToDelete);
    setLists(newLists);
    setDeviceSets(newDeviceSets);
    setSelectedIndex(prev => (prev === indexToDelete ? 0 : prev > indexToDelete ? prev - 1 : prev));
    setConfirmDeleteIndex(null);
    setLongPressedIndex(null);

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
    <Pressable onPress={() => setLongPressedIndex(null)} style={{ flex: 1 }}>
      <Background />
      <AppText style={appTextStyles.text1}>TTALKKAG</AppText>
      <AppText style={appTextStyles.text3}>Trigger</AppText>
      <AppText style={appTextStyles.text2}>트리거 페이지</AppText>

      {/* 목록 */}
      <View style={{ height: 60, marginTop: 20 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 35 }}
        >
          {lists.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedIndex(index);
                setLongPressedIndex(null); // 목록 누르면 삭제모드 해제
              }}
              activeOpacity={1}
            >
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

     {confirmDeleteIndex !== null && (
  <View
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)', // 반투명 검정 배경
      zIndex: 999,
    }}
  >
    {/* 배경을 누르면 삭제창 닫기 */}
    <TouchableOpacity
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      onPress={cancelDelete}
    />
    
    {/* 삭제 확인 창 */}
    <View
      style={{
        width: '60%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 10,
        zIndex: 1000,
      }}
    >
      <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
        정말 삭제하시겠습니까?
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <TouchableOpacity onPress={confirmDelete}>
          <Text style={{ fontSize: 18, color: 'red' }}>O</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cancelDelete}>
          <Text style={{ fontSize: 18 }}>X</Text>
        </TouchableOpacity>
      </View>
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
                  ? deactivateDeviceBox(doorId, item.deviceId, item.deviceType)
                  : handleDeviceToggle(doorId, item.deviceId, item.deviceType);
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
    </Pressable>
  );
};

export default TPage;
