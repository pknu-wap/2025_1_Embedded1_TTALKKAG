import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, TouchableOpacity, FlatList, Text, Alert,Pressable,
} from 'react-native';
import Background from "./components/Background";
import { AppText, styles as appTextStyles } from "./components/AppText";
import { TriggerList } from "./components/TriggerList";
import { TriggerDeviceBox } from "./components/TriggerDeviceBox";
import {
  fetchDeviceList,
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

  // 앱이 켜지면 목록과 디바이스 불러오기
  useEffect(() => {
  const loadAll = async () => {
    try {
      //  UI 테스트용 더미 데이터 
      
      /*const dummyDevices = [
        { name: '버튼 1', deviceId: 101, deviceType: 'button_clicker', status: false },
        { name: '버튼 2', deviceId: 102, deviceType: 'button_clicker', status: true },
        { name: '다이얼 1', deviceId: 201, deviceType: 'dial_actuator', status: false },
        { name: '다이얼 2', deviceId: 202, deviceType: 'dial_actuator', status: true },
      ];
      setLists(['테스트 목록 A', '테스트 목록 B']);
      setListObjects([{ id: 999 }, { id: 1000 }]); // 테스트용 트리거 ID
      setDeviceSets([dummyDevices, dummyDevices]); // 두 개 목록에 동일한 디바이스들
      return;  */
      
      // 1. 전체 기기 목록 불러오기 (off 상태로 초기화)
      const allDevices = await fetchDeviceList();
      const deviceMap = {};

      const allDeviceBoxes = [
        ...allDevices.data.buttons.map(b => {
          const obj = { name: b.name, deviceId: b.id, deviceType: "button_clicker", status: false };
          deviceMap[`${b.id}_button_clicker`] = obj;
          return obj;
        }),
        ...allDevices.data.dials.map(d => {
          const obj = { name: d.name, deviceId: d.id, deviceType: "dial_actuator", status: false };
          deviceMap[`${d.id}_dial_actuator`] = obj;
          return obj;
        })
      ];

      // 2. 트리거 목록 불러오기
      const triggerLists = await fetchTriggerLists();
      setLists(triggerLists.map(item => item.name));
      setListObjects(triggerLists);

      // 3. 트리거에 속한 디바이스 목록 불러오기 (각 목록에 대해)
      const allDeviceSets = await Promise.all(
        triggerLists.map(async (list) => {
          const activeDevices = await fetchTriggerDevices(list.id);
          const updated = allDeviceBoxes.map(device => {
            const match = activeDevices.find(
              ad => ad.id.deviceId === device.deviceId && ad.id.deviceType === device.deviceType
            );
            return {
              ...device,
              status: !!match  // true if match found
            };
          });
          return updated;
        })
      );

      setDeviceSets(allDeviceSets);
    } catch (err) {
      console.error("디바이스/목록 로딩 실패:", err);
      Alert.alert("오류", "초기 로딩에 실패했습니다.");
    }
  };

  loadAll();
}, []);

//목록 바뀔때마다 새로고침
/*useEffect(() => {
  const loadSelectedDevices = async () => {
    const list = listObjects[selectedIndex];
    if (!list) return;

    try {
      const allDevices = await fetchDeviceList();  // 전체 디바이스 목록
      const allDeviceBoxes = [
        ...allDevices.data.buttons.map(b => ({
          name: b.name,
          deviceId: b.id,
          deviceType: "button_clicker",
          status: false
        })),
        ...allDevices.data.dials.map(d => ({
          name: d.name,
          deviceId: d.id,
          deviceType: "dial_actuator",
          status: false
        }))
      ];

      const activeDevices = await fetchTriggerDevices(list.id);
      const updated = allDeviceBoxes.map(device => {
        const match = activeDevices.find(
          ad => ad.id.deviceId === device.deviceId && ad.id.deviceType === device.deviceType
        );
        return {
          ...device,
          status: !!match
        };
      });

      const updatedDeviceSets = [...deviceSets];
      updatedDeviceSets[selectedIndex] = updated;
      setDeviceSets(updatedDeviceSets);
    } catch (error) {
      console.error("선택 목록 디바이스 로딩 실패:", error);
      Alert.alert("오류", "선택한 목록의 디바이스를 불러오지 못했습니다.");
    }
  };

  loadSelectedDevices();
}, [selectedIndex]); */ // ← selectedIndex가 바뀔 때마다 실행

//디바이스 박스 활성화/비활성화
const handleDeviceToggle = async (device, index) => {
  const triggerDeviceId = listObjects[selectedIndex]?.id;
  if (!triggerDeviceId) {
    console.warn("triggerDeviceId가 없습니다!");
    return;
  }
  //데이터 전송 확인용 
  console.log("[🔁 전송 요청]", {
  triggerDeviceId,
  deviceId: device.deviceId,
  deviceType: device.deviceType
});     
  try {
    if (device.status) {
      // 비활성화 요청
      const payload = {
        triggerDeviceId,
        deviceId: device.deviceId,
        deviceType: device.deviceType,
      };
      const response = await deactivateDeviceBoxApi(payload);
      if (response.status === 200) {
        updateDeviceStatus(index, false);
      }
    } else {
      // 활성화 요청
      const response = await activateDeviceBox(triggerDeviceId, device.deviceId, device.deviceType);
      if (response.status === 200) {
        updateDeviceStatus(index, true);
      }
    }
  } catch (error) {
    console.error("디바이스 상태 변경 실패:", error);
    Alert.alert("오류", "디바이스 상태 변경 실패");
  }
};
    const updateDeviceStatus = (index, newStatus) => {
    const updated = [...deviceSets];
    updated[selectedIndex][index].status = newStatus;
    setDeviceSets(updated);
    };

//목록 삭제 기능
   const confirmDelete = async () => {
  const indexToDelete = confirmDeleteIndex;
  const list = listObjects[indexToDelete];

  if (!list) return;

  const payload = {
    type: list.triggerType, // ✅ triggerType 추가
    deviceId: list.id
  };

  try {
    // API 호출로 목록 삭제 요청
    await deleteDevice(payload);

    // 목록과 디바이스 상태 업데이트
    const newLists = lists.filter((_, i) => i !== indexToDelete);
    const newDeviceSets = deviceSets.filter((_, i) => i !== indexToDelete);
    const newListObjects = listObjects.filter((_, i) => i !== indexToDelete);

    // 상태 업데이트
    setLists(newLists);
    setDeviceSets(newDeviceSets);
    setListObjects(newListObjects);

    // 삭제된 항목 기준으로 selectedIndex 보정
    setSelectedIndex((prev) => (
      prev === indexToDelete ? 0 : prev > indexToDelete ? prev - 1 : prev
    ));

    // 삭제창 닫기 및 초기화
    setConfirmDeleteIndex(null);
    setLongPressedIndex(null);
  } catch (err) {
    Alert.alert("삭제 실패", "서버 요청 실패");
    console.error("트리거 삭제 실패:", err.message);
  }
};

  // 목록 삭제 요청 처리
const handleDeleteRequest = (index) => {
  setConfirmDeleteIndex(index); // 삭제 확인창을 표시
};

  // 삭제 요청 취소 함수
const cancelDelete = () => {
  setConfirmDeleteIndex(null);
  setLongPressedIndex(null); 
};

//목록 이름 변경 
  const handleListNameChange = async (newName, index) => {
  const list = listObjects[index];
  if (!list) return;

  try {
    // API 호출
    await changeListName(list.id, list.triggerType, newName);

    // 상태 업데이트
    const updatedLists = [...lists];
    updatedLists[index] = newName;
    setLists(updatedLists);

    // 목록 객체 업데이트
    const updatedListObjects = [...listObjects];
    updatedListObjects[index] = { ...list, name: newName };
    setListObjects(updatedListObjects);
  } catch (err) {
    Alert.alert("목록 이름 변경 실패", "서버 요청 실패");
    console.error("목록 이름 변경 실패:", err.message);
  }
};

//디바이스 이름변경 
  const handleDeviceNameChange = async (newName, index) => {
  const device = deviceSets[selectedIndex][index];
  if (!device) return;

  try {
    // API 호출
    await changeDeviceName(device.deviceId, device.deviceType, newName);

    // 상태 업데이트
    const updatedDeviceSets = [...deviceSets];
    updatedDeviceSets[selectedIndex][index] = {
      ...device,
      name: newName,
    };
    setDeviceSets(updatedDeviceSets);
  } catch (err) {
    Alert.alert("디바이스 이름 변경 실패", "서버 요청 실패");
    console.error("디바이스 이름 변경 실패:", err.message);
  }
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
                setConfirmDeleteIndex(null);
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

      {/* 삭제 확인 창 */}
     {confirmDeleteIndex !== null && (
  <TouchableOpacity 
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    }}
    activeOpacity={1} // 부모의 onPress 이벤트 차단
    onPress={cancelDelete} // 배경 클릭 시 삭제창 닫기
  >
    <View style={{
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      elevation: 10,
      width: '80%',
    }}>
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
  </TouchableOpacity>
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
              onToggle={() => handleDeviceToggle(item, index)}
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
