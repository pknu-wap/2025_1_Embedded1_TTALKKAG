import React, { useState } from 'react';
import {
  ScrollView, View, TouchableOpacity, FlatList, Text,
} from 'react-native';
import Background from "./components/Background";
import { AppText, styles as appTextStyles } from "./components/AppText";
import { TriggerList } from "./components/TriggerList";
import { TriggerDeviceBox } from "./components/TriggerDeviceBox";

const initialLists = ['목록1', '목록2', '목록3', '목록4', '목록5'];

const initialDeviceTemplate = [
  { name: '디바이스 1', status: false },
  { name: '디바이스 2', status: false },
  { name: '디바이스 3', status: false },
  { name: '디바이스 4', status: false },
  { name: '디바이스 5', status: false },
  { name: '디바이스 6', status: false },
  { name: '디바이스 7', status: false },
  { name: '디바이스 8', status: false },
];

const generateDeviceSets = () => 
  initialLists.map(() => initialDeviceTemplate.map(device => ({ ...device })));

const TPage = () => {
  const [lists, setLists] = useState(initialLists);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deviceSets, setDeviceSets] = useState(generateDeviceSets());
  const [editingListIndex, setEditingListIndex] = useState(null);
  const [editingDeviceIndex, setEditingDeviceIndex] = useState(null);

  const handleDeviceToggle = (deviceIndex) => {
    setDeviceSets(prevSets => {
      const updatedSets = [...prevSets];
      const currentList = [...updatedSets[selectedIndex]];
      currentList[deviceIndex].status = !currentList[deviceIndex].status;
      updatedSets[selectedIndex] = currentList;
      return updatedSets;
    });
  };

  const handleListNameChange = (newName, index) => {
    const updated = [...lists];
    updated[index] = newName;
    setLists(updated);
    setEditingListIndex(null);
  };

  const handleDeviceNameChange = (newName, index) => {
    setDeviceSets(prevSets => {
      const updatedSets = [...prevSets];
      const currentList = [...updatedSets[selectedIndex]];
      currentList[index].name = newName;
      updatedSets[selectedIndex] = currentList;
      return updatedSets;
    });
    setEditingDeviceIndex(null);
  };

  const handleDeleteList = (indexToDelete) => {
    const newLists = lists.filter((_, i) => i !== indexToDelete);
    const newDeviceSets = deviceSets.filter((_, i) => i !== indexToDelete);
    setLists(newLists);
    setDeviceSets(newDeviceSets);

    setSelectedIndex(prev => {
      if (prev === indexToDelete) return 0;
      if (prev > indexToDelete) return prev - 1;
      return prev;
    });
  };

  const [longPressedIndex, setLongPressedIndex] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);  // 삭제 확인용
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);        // 되돌리기용

 // 삭제 요청이 들어오면 index 저장만 해둠
  const handleDeleteRequest = (index) => {
    setConfirmDeleteIndex(index);
};

  const confirmDelete = () => {
  const indexToDelete = confirmDeleteIndex;
  const deletedList = lists[indexToDelete];
  const deletedDevices = deviceSets[indexToDelete];

  setRecentlyDeleted({
    list: deletedList,
    devices: deletedDevices,
    index: indexToDelete,
  });

  // 삭제 처리
  const newLists = lists.filter((_, i) => i !== indexToDelete);
  const newDeviceSets = deviceSets.filter((_, i) => i !== indexToDelete);
  setLists(newLists);
  setDeviceSets(newDeviceSets);

  setSelectedIndex(prev => {
    if (prev === indexToDelete) return 0;
    if (prev > indexToDelete) return prev - 1;
    return prev;
  });

  setConfirmDeleteIndex(null); // 창 닫기
};

const cancelDelete = () => {
  setConfirmDeleteIndex(null); 
  setLongPressedIndex(null);
};

const handleUndo = () => { //되돌리기기
  if (!recentlyDeleted) return;

  const { list, devices, index } = recentlyDeleted;
  const newLists = [...lists];
  const newDeviceSets = [...deviceSets];

  newLists.splice(index, 0, list);
  newDeviceSets.splice(index, 0, devices);

  setLists(newLists);
  setDeviceSets(newDeviceSets);
  setRecentlyDeleted(null);
};


  return (
    <View style={{ flex: 1 }}>
      <Background />
      <AppText style={appTextStyles.text1}>TTALKKAG</AppText>
      <AppText style={appTextStyles.text3}>Trigger</AppText>
      <AppText style={appTextStyles.text2}>트리거 페이지</AppText>
   
      <View style={{ height: 60, marginTop: 55 }}>
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
                onSubmit={(finalName) => handleListNameChange(finalName.slice(0, 7), index)}
                //onDeleteRequest={() => handleDeleteList(index)}
                onLongPress={() => setLongPressedIndex(index)}
                showDelete={longPressedIndex === index}
                onDeleteRequest={() => handleDeleteRequest(index)}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
       {recentlyDeleted && (
  <TouchableOpacity onPress={handleUndo} style={{ alignSelf: 'center', marginTop: 3 }}>
    <Text style={{ color: 'fff' ,fontWeight: 'bold'}}>되돌리기</Text>
  </TouchableOpacity>
    )}
      <View style={{ flex: 1 }}>
        <FlatList
          data={deviceSets[selectedIndex]}
          renderItem={({ item, index }) => (
            <TriggerDeviceBox
              item={item}
              index={index}
              onToggle={handleDeviceToggle}
              isEditing={editingDeviceIndex === index}
              onEditStart={() => setEditingDeviceIndex(index)}
              onNameChange={(newName) => {
                setDeviceSets(prevSets => {
                  const updatedSets = [...prevSets];
                  const currentList = [...updatedSets[selectedIndex]];
                  currentList[index].name = newName;
                  updatedSets[selectedIndex] = currentList;
                  return updatedSets;
                });
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
      {confirmDeleteIndex !== null && (
  <View style={{ position: 'absolute', top: '40%', left: '20%', right: '20%', backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 10 }}>
    <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>정말 삭제할까요?</Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <TouchableOpacity onPress={confirmDelete}>
        <Text style={{ fontSize: 18, color: 'red' }}>O</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={cancelDelete}>
        <Text style={{ fontSize: 18 }}>X</Text>
      </TouchableOpacity>
    </View>
  </View>
)}


    </View>
  );
};

export default TPage;
