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
  const [lists, setLists] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deviceSets, setDeviceSets] = useState([]);
  const [editingListIndex, setEditingListIndex] = useState(null);
  const [editingDeviceIndex, setEditingDeviceIndex] = useState(null);
  const [longPressedIndex, setLongPressedIndex] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [listObjects, setListObjects] = useState([]);

  const dummyLists = [
    { id: 1, name: "List 1" },
    { id: 2, name: "List 2" },
    { id: 3, name: "List 3" },
  ];
  const dummyDevices = {
    1: [
      { name: "Device 1-1", deviceId: "d1-1", type: "light", status: false },
      { name: "Device 1-2", deviceId: "d1-2", type: "fan", status: true },
    ],
    2: [
      { name: "Device 2-1", deviceId: "d2-1", type: "heater", status: false },
      { name: "Device 2-2", deviceId: "d2-2", type: "AC", status: true },
    ],
    3: [
      { name: "Device 3-1", deviceId: "d3-1", type: "TV", status: true },
      { name: "Device 3-2", deviceId: "d3-2", type: "Speaker", status: false },
    ],
  };

  useEffect(() => {
    setLists(dummyLists.map(item => item.name));
    setListObjects(dummyLists);
    const deviceSetsByList = dummyLists.map(item => dummyDevices[item.id]);
    setDeviceSets(deviceSetsByList);
  }, []);

  useEffect(() => {
    const loadListsAndDevices = async () => {
      try {
        const listData = await fetchTriggerLists();
        setLists(listData.map(item => item.name));
        setListObjects(listData);
        const deviceSetsByList = await Promise.all(
          listData.map(async (item) => {
            const devices = await fetchTriggerDevices(item.id);
            return devices.map(device => ({
              name: device.id.deviceType,
              deviceId: device.id.deviceId,
              type: device.id.deviceType,
              status: device.status ?? false,
            }));
          })
        );
        setDeviceSets(deviceSetsByList);
      } catch (error) {
        console.error("Error loading lists and devices:", error);
        setLists(dummyLists.map(item => item.name));
        setListObjects(dummyLists);
        const deviceSetsByList = dummyLists.map(item => dummyDevices[item.id]);
        setDeviceSets(deviceSetsByList);
      }
    };
    loadListsAndDevices();
  }, []);

  useEffect(() => {
    const loadDevicesForSelected = async () => {
      const selected = listObjects[selectedIndex];
      if (!selected) return;
      try {
        const devices = await fetchTriggerDevices(selected.id);
        const mapped = devices.map(device => ({
          name: device.id.deviceType,
          deviceId: device.id.deviceId,
          type: device.id.deviceType,
          status: device.status ?? false,
        }));
        const newSets = [...deviceSets];
        newSets[selectedIndex] = mapped;
        setDeviceSets(newSets);
      } catch (e) {
        console.error("디바이스 새로고침 실패:", e);
      }
    };
    loadDevicesForSelected();
  }, [selectedIndex]);

  const handleDeviceToggle = async (index) => {
  const device = deviceSets[selectedIndex][index];
  const doorId = listObjects[selectedIndex].id;

  if (device.status) {
    await deactivateDeviceBox(doorId, device.deviceId, device.type);
    const updated = [...deviceSets];
    updated[selectedIndex][index].status = false;
    setDeviceSets(updated);
  } else {
    const res = await activateDeviceBox(doorId, device.deviceId, device.type);
    if (res.status === 200) {
      const updated = [...deviceSets];
      updated[selectedIndex][index].status = true;
      setDeviceSets(updated);
    }
  }
};

  const handleActivateDevice = async (doorId, deviceId, deviceType) => {
    try {
      const response = await activateDeviceBox(doorId, deviceId, deviceType);
      if (response.status === 200) {
        Alert.alert("성공", "디바이스가 성공적으로 활성화되었습니다.");
        const updatedDevices = [...deviceSets];
        const targetDevice = updatedDevices[selectedIndex].find(d => d.deviceId === deviceId);
        if (targetDevice) targetDevice.status = true;
        setDeviceSets(updatedDevices);
      } else {
        Alert.alert("실패", "디바이스 활성화 요청이 실패했습니다.");
      }
    } catch (error) {
      console.error("디바이스 활성화 오류:", error);
      Alert.alert("오류", "디바이스 활성화 중 문제가 발생했습니다.");
    }
  };

  const deactivateDeviceBox = async (doorId, deviceId, deviceType) => {
    try {
      const payload = { doorId, deviceId, deviceType };
      const response = await deactivateDeviceBoxApi(payload);
      if (response.status === 200) {
        Alert.alert("성공", "디바이스가 비활성화되었습니다.");
      } else {
        console.warn("디바이스 비활성화 요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("디바이스 비활성화 중 오류 발생:", error.message);
      Alert.alert("오류", "디바이스 비활성화 요청에 실패했습니다.");
    }
  };

  const handleListNameChange = async (newName, index) => {
    try {
      const listId = listObjects[index].id;
      await changeListName(listId, "button", newName);
      const updated = [...lists];
      updated[index] = newName;
      setLists(updated);
      setEditingListIndex(null);
    } catch (err) {
      Alert.alert("오류", "목록 이름 변경 실패");
    }
  };

  const handleDeviceNameChange = async (newName, index) => {
    try {
      const target = deviceSets[selectedIndex][index];
      await changeDeviceName(target.deviceId, target.type, newName);
      const updatedSets = [...deviceSets];
      updatedSets[selectedIndex][index].name = newName;
      setDeviceSets(updatedSets);
      setEditingDeviceIndex(null);
    } catch (err) {
      Alert.alert("오류", "디바이스 이름 변경 실패");
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
    try {
      const listId = listObjects[indexToDelete].id;
      await deleteDevice({ type: "button", deviceId: listId });
    } catch (err) {
      console.error("백엔드 목록 삭제 실패:", err);
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
                onSubmit={(finalName) => handleListNameChange(finalName.slice(0, 7), index)}
                onLongPress={() => setLongPressedIndex(index)}
                showDelete={longPressedIndex === index}
                onDeleteRequest={() => handleDeleteRequest(index)}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {confirmDeleteIndex !== null && (
        <View style={{ position: 'absolute', top: '40%', left: '20%', right: '20%', backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 10 }}>
          <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>정말 삭제하시겠습니까까?</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={confirmDelete}><Text style={{ fontSize: 18, color: 'red' }}>O</Text></TouchableOpacity>
            <TouchableOpacity onPress={cancelDelete}><Text style={{ fontSize: 18 }}>X</Text></TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <FlatList
          data={deviceSets[selectedIndex] || []}
          renderItem={({ item, index }) => (
            <TriggerDeviceBox
              item={item}
              index={index}
              onToggle={handleDeviceToggle}
              isEditing={editingDeviceIndex === index}
              onEditStart={() => setEditingDeviceIndex(index)}
              onNameChange={(newName) => {
                const updatedSets = [...deviceSets];
                updatedSets[selectedIndex][index].name = newName;
                setDeviceSets(updatedSets);
              }}
              onSubmit={(finalName) => handleDeviceNameChange(finalName.slice(0, 7), index)}
            />
          )}
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
