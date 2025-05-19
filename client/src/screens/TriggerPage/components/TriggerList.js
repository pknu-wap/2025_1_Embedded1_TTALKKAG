import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const TriggerList = ({ text, isSelected }) => {
  return (
    <View style={[styles.listItem, isSelected && styles.selected]}>
      <Text style={[styles.text, { color: isSelected ? '#000' : '#888' }]}>{text}</Text>
      <Image
        source={require('../../../../assets/setting_icon.png')} 
        style={styles.editIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 25,
    paddingVertical: 8,
  },
  selected: {
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 15,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  editIcon: {
    width: 14,
    height: 14,
    marginLeft: 6,
  },
});

export { TriggerList };
