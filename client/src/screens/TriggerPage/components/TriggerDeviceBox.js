import React from 'react';
import {
  Text, TouchableOpacity, Image, ImageBackground, StyleSheet, TextInput,View
} from 'react-native';

const TriggerDeviceBox = ({ item, index, onToggle, isEditing, onEditStart, onNameChange, onSubmit }) => {
  const isOn = item.status;

    // 타입별 아이콘 설정
  let iconSource= require('../../../../assets/device_icon.png');
  if (item.deviceType === "dial_actuator") {
    iconSource = require('../../../../assets/dial_icon.png');
  } else if (item.deviceType === "button_clicker") {
    iconSource = require('../../../../assets/button_icon.png');
  } 
  console.log('전체 item:', item);

  return (
    <TouchableOpacity onPress={() => {
  if (typeof onToggle === 'function') {
    onToggle(index);
  } else {
    console.warn("onToggle is not defined!");
  }
}}style={styles.wrapper}>
      <ImageBackground
        source={
          isOn
            ? require('../../../../assets/TriggerDeviceBox_on.png')
            : require('../../../../assets/TriggerDeviceBox_off.png')
        }
        style={styles.box}
        imageStyle={{ borderRadius: 20 }}
      >
           {/* 디바이스 아이콘 영역 */}
        <View style={styles.headerRow}>
          <Image
            source={iconSource}
            style={styles.deviceIcon}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity onPress={onEditStart}>
          {isEditing ? (
            <TextInput
              value={item.name}
              onChangeText={onNameChange}
              onSubmitEditing={() => onSubmit(item.name)}
              style={styles.nameInput}
              autoFocus
              maxLength={7}
              blurOnSubmit={true}
              keyboardType="default"
              textContentType="none"
              autoCorrect={false}
              autoComplete="off"
              importantForAutofill="no"
              onBlur={() => onSubmit(item.name)}
            />
          ) : (
            <Text style={styles.name}>{item.name}</Text>
          )}
        </TouchableOpacity>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 175,
    height: 200,
    aspectRatio: 1,
   marginRight: 20,   
    marginVertical: -6,
  },
  box: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
    position: 'relative',
  },
 deviceIcon: {
  width: 45,
  height: 45,
  position: 'absolute', // 절대 위치
  top: 20,              // Y축 위치 조정
  left: 10,             // X축 위치 조정
},
  icon: {
    width: 37,
    height: 30,
    marginBottom: 10,
    marginTop: 25,
    marginLeft: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  nameInput: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#eee',
    paddingHorizontal: 6,
    borderRadius: 8,
    marginLeft: 10,
    width: 120,
  },
  headerRow: {
  height: 70,  // 아이콘 높이 이상으로 설정
  position: 'relative',
},
});

export { TriggerDeviceBox };
