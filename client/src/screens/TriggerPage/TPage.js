import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, TouchableOpacity, FlatList, Text, Alert,
} from 'react-native';
import Background from "./components/Background";
import { AppText, styles as appTextStyles } from "./components/AppText";
import { TriggerList } from "./components/TriggerList";
import { TriggerDeviceBox } from "./components/TriggerDeviceBox";
import {
  fetchTriggerLists,         // 서버에서 목록(리스트) 데이터 가져오기
  fetchTriggerDevices,       // 서버에서 각 목록에 연결된 디바이스 정보 가져오기
  renameDevice,              // 디바이스 이름 변경 요청
  renameList,                // 목록 이름 변경 요청
  deleteTriggerList,         // 목록 삭제 요청
  updateDeviceStatus         // 디바이스 상태(ON/OFF) 변경 요청
} from "../../api/triggerApi";

const TPage = () => {
  const [lists, setLists] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deviceSets, setDeviceSets] = useState([]);
  const [editingListIndex, setEditingListIndex] = useState(null);
  const [editingDeviceIndex, setEditingDeviceIndex] = useState(null);
  const [longPressedIndex, setLongPressedIndex] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [listObjects, setListObjects] = useState([]); 

  // 앱 켜면 목록,디바이스박스 정보 호출
  useEffect(() => {
    const loadListsAndDevices = async () => {
      const listData = await fetchTriggerLists(); // 목록 가져오기
      setLists(listData.map(item => item.name));  // 이름만 따로 저장
      setListObjects(listData);                   // 전체 객체 저장 (id 포함)

      const deviceData = await fetchTriggerDevices(); // 디바이스들 가져오기

      // 각 목록 id 기준으로 디바이스를 연결해서 그룹으로 정리리
      const doorIds = listData.map(item => item.id);
      const deviceSetsByList = doorIds.map(doorId => {
        const filtered = deviceData.filter(d => d.id.doorId === doorId);
        return filtered.map(d => ({
          name: d.name || d.id.deviceType,   // 디바이스이름 
          deviceId: d.id.deviceId,           // 디바이스 고유 ID
          type: d.id.deviceType,             // 디바이스 타입 
          status: d.status ?? false        
        }));
      });
      setDeviceSets(deviceSetsByList); // 상태에 저장
    };
    loadListsAndDevices();
  }, []);

  // 디바이스 on/off 변경 시 서버에도 업데이트 요청 
  const handleDeviceToggle = async (deviceIndex) => {
    try {
      const updated = [...deviceSets];
      const currentList = [...updated[selectedIndex]];
      const device = currentList[deviceIndex];
      const newStatus = !device.status;

      // 서버로 상태 업데이트 요청 보내기
      await updateDeviceStatus({
        deviceId: device.deviceId,
        type: device.type,
        status: newStatus
      });

      // 로컬 상태 업데이트
      currentList[deviceIndex].status = newStatus;
      updated[selectedIndex] = currentList;
      setDeviceSets(updated);
    } catch (err) {
      Alert.alert("오류", "기기 상태 변경 실패");
    }
  };

  // ✅ 목록 이름 변경 시 서버에 변경 요청
  const handleListNameChange = async (newName, index) => {
    try {
      const listId = listObjects[index].id; // 서버에 보낼 목록 ID
      await renameList({ listId, newName });

      const updated = [...lists];
      updated[index] = newName;
      setLists(updated);
      setEditingListIndex(null);
    } catch (err) {
      Alert.alert("오류", "목록 이름 변경 실패");
    }
  };

  // ✅ 디바이스 이름 변경 시 서버에 변경 요청
  const handleDeviceNameChange = async (newName, index) => {
    try {
      const target = deviceSets[selectedIndex][index];
      await renameDevice({
        type: target.type,
        deviceId: target.deviceId,
        newName
      });
      const updatedSets = [...deviceSets];
      updatedSets[selectedIndex][index].name = newName;
      setDeviceSets(updatedSets);
      setEditingDeviceIndex(null);
    } catch (err) {
      Alert.alert("오류", "디바이스 이름 변경 실패");
    }
  };

  // 삭제 버튼을 눌렀을 때 삭제 대상 인덱스만 저장
  const handleDeleteRequest = (index) => setConfirmDeleteIndex(index);

  // 정말 삭제할지 확인한 후 목록을 삭제하고 서버에도 삭제 요청 보냄
  const confirmDelete = async () => {
    const indexToDelete = confirmDeleteIndex;
    const deletedList = lists[indexToDelete];
    const deletedDevices = deviceSets[indexToDelete];
    setRecentlyDeleted({ list: deletedList, devices: deletedDevices, index: indexToDelete });

    const newLists = lists.filter((_, i) => i !== indexToDelete);
    const newDeviceSets = deviceSets.filter((_, i) => i !== indexToDelete);
    setLists(newLists);
    setDeviceSets(newDeviceSets);

    setSelectedIndex(prev => (prev === indexToDelete ? 0 : prev > indexToDelete ? prev - 1 : prev));
    setConfirmDeleteIndex(null);

    // 서버에 삭제 요청 보내기 (type은 고정값 또는 목록에 따라 설정)
    try {
      const listId = listObjects[indexToDelete].id;
      const type = "button";
      await deleteTriggerList({ type, deviceId: listId });
    } catch (err) {
      console.error("백엔드 목록 삭제 실패:", err);
    }
  };

  // 삭제 취소 버튼 (X) 클릭 시 상태 초기화
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

      {/* 목록  */}
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

      {/* 삭제 확인 창 */}
      {confirmDeleteIndex !== null && (
        <View style={{ position: 'absolute', top: '40%', left: '20%', right: '20%', backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 10 }}>
          <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>정말 삭제하시겠습니까까?</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={confirmDelete}><Text style={{ fontSize: 18, color: 'red' }}>O</Text></TouchableOpacity>
            <TouchableOpacity onPress={cancelDelete}><Text style={{ fontSize: 18 }}>X</Text></TouchableOpacity>
          </View>
        </View>
      )}

      {/* 디바이스 박스 */}
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
