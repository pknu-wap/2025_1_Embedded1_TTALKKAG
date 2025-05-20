// TPage.js
import React, { useState } from 'react';
import {
  ScrollView, View, TouchableOpacity, FlatList
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
            <TouchableOpacity key={index} onPress={() => setSelectedIndex(index)}>
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
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
    </View>
  );
};

export default TPage;
