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
    <View
  style={[
    styles.listItem,
    isSelected && styles.selected,
    showDelete && { backgroundColor: '#ff4d4d' },  // showDelete가 true면 빨간색 배경 추가
  ]}
>
      <View style={styles.textWrapper}>
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
            onBlur={() => onSubmit(text)}
          />
        ) : (
          <Pressable onLongPress={onLongPress}>
            <Text
              style={[
                styles.text,
                { color: showDelete ? 'transparent' : isSelected ? '#000' : '#888' },
              ]}
            >
              {text}
            </Text>
          </Pressable>
        )}
     {/* X 삭제 버튼 */}
        {showDelete && (
          <TouchableOpacity onPress={onDeleteRequest} style={styles.deleteXWrapper}>
            <Text style={styles.deleteX}>X</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={onEditPress}>
  <Image
    source={require('../../../../assets/pencil_icon.png')}
    style={[
      styles.editIcon,
      { opacity: showDelete ? 0 : 1 }  // showDelete가 true면 투명하게
    ]}
  />
</TouchableOpacity>
     
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
  textWrapper: {
    position: 'relative', // X버튼을 텍스트 위에 배치하기 위해 필요
    justifyContent: 'center',
    alignItems: 'center',
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
   deleteXWrapper: {
    position: 'absolute',
    top: -6,// X표시의 세로 위치를 조절합니다 (위로 이동: 음수, 아래로 이동: 양수)
    right: -1,// X표시의 가로 위치를 조절합니다 (오른쪽으로 이동: 음수, 왼쪽으로 이동: 양수)
    zIndex: 10,
  },
  deleteX: {
    fontSize: 23,
    color: 'black',
    //fontWeight: 'bold',
  },
});

export { TriggerList };
