import React from 'react';
import {
  Text, TouchableOpacity, Image, ImageBackground, StyleSheet, TextInput
} from 'react-native';

const TriggerDeviceBox = ({ item, index, onToggle, isEditing, onEditStart, onNameChange, onSubmit }) => {
  const isOn = item.status;

  return (
    <TouchableOpacity onPress={() => onToggle(index)} style={styles.wrapper}>
      <ImageBackground
        source={
          isOn
            ? require('../../../../assets/TriggerDeviceBox_on.png')
            : require('../../../../assets/TriggerDeviceBox_off.png')
        }
        style={styles.box}
        imageStyle={{ borderRadius: 20 }}
      >
        <Image
          source={require('../../../../assets/device_icon.png')}
          style={styles.icon}
        />
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
    marginHorizontal: 10,
    marginVertical: -6,
  },
  box: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
    position: 'relative',
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
});

export { TriggerDeviceBox };
