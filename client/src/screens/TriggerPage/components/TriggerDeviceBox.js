import React from 'react';
import {
  View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet
} from 'react-native';

const TriggerDeviceBox = ({ item, index, onToggle }) => {
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
        <Text style={styles.name}>{item.name}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width:175,
    height:200,
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
    marginTop:25,
    marginLeft:10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    marginLeft:10,
  },
});

export { TriggerDeviceBox };
