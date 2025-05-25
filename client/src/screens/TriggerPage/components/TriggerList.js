import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';

const TriggerList = ({
  text,
  isSelected,
  isEditing,
  onEditPress,
  onNameChange,
  onSubmit,
  onLongPress,
  showDelete,
  onDeleteRequest,
}) => {
  return (
    <View style={[styles.listItem, isSelected && styles.selected]}>
      {isEditing ? (
        <TextInput
          style={[styles.text, styles.input]}
          value={text}
          onChangeText={onNameChange}
          onSubmitEditing={() => onSubmit(text)}
          maxLength={7}
          autoFocus
          blurOnSubmit={true}
          keyboardType="default"
          textContentType="none"
          autoCorrect={false}
          autoComplete="off"
          importantForAutofill="no"
        />
      ) : (
        <Pressable onLongPress={onLongPress}>
          <Text style={[styles.text, { color: isSelected ? '#000' : '#888' }]}>
            {text}
          </Text>
        </Pressable>
      )}

      <TouchableOpacity onPress={onEditPress}>
        <Image
          source={require('../../../../assets/pencil_icon.png')}
          style={styles.editIcon}
        />
      </TouchableOpacity>

      {showDelete && (
        <TouchableOpacity onPress={onDeleteRequest}>
          <Text style={styles.deleteX}>X</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 50,
    paddingVertical: 9,
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
  input: {
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    borderRadius: 10,
    minWidth: 60,
  },
  editIcon: {
    width: 14,
    height: 14,
    marginLeft: 6,
    tintColor: '#b0b0b0',
  },
  deleteX: {
    marginLeft: 5,
    fontSize: 16,
    color: 'blue',
    fontWeight: 'bold',
  },
});

export { TriggerList };
