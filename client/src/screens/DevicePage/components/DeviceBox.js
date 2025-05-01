import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Animated,
  Alert,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { pressDevice, changeDeviceName, deleteDevice } from '../../../api/deviceApi';

const { width, height } = Dimensions.get("window");

const DeviceBox = ({ id, name, type, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pressed, setPressed] = useState(false);

  // 이름 수정 관련 상태
  const [isEditing, setIsEditing] = useState(false);
  const [deviceName, setDeviceName] = useState(name);
  const [tempName, setTempName] = useState(name);

  // 오른쪽 borderRadius 
  const [rightRadius, setRightRadius] = useState(31);

  // 전원 버튼
  const handlePress = async () => {
    setPressed(prev => !prev);
    setLoading(true);
    try {
      await pressDevice(id);
    } catch (err) {
      setPressed(prev => !prev);
    } finally {
      setLoading(false);
    }
  };

  // 이름 수정
  const handleName = async () => {
    if (tempName.trim() === '') {
      setTempName(deviceName);
      setIsEditing(false);
      return;
    }
    setIsEditing(false);
    if (tempName !== deviceName) {
      try {
        await changeDeviceName(id, type, tempName);
        setDeviceName(tempName);
      } catch (err) {
        setTempName(deviceName);
      }
    }
  };

  // 삭제
  const handleDelete = async () => {
    Alert.alert(
      "기기 삭제",
      "정말로 이 기기를 삭제하시겠습니까?",
      [
        {
          text: "아니요",
        },
        {
          text: "예",
          onPress: async () => {
            try {
              await deleteDevice({ type, deviceId: id });
              onDelete(id,type); 
            } catch (err) {
              Alert.alert("삭제 실패", "기기를 제거하는 중 오류가 발생했습니다.");
              console.log("에러메시지", err.message)
            }
          }
        }
      ],
    );
  };
  
  // 삭제 버튼
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={{ transform: [{ translateX: trans }] }}>
        <TouchableOpacity style={deleteButtonStyle} onPress={handleDelete}>
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const isDial = type === "dial_actuator";
  const isExpanded = isDial && expanded;

  // 삭제 버튼 스타일 동적 적용
  const deleteButtonStyle = [
    styles.deleteButton,
    {
      borderTopRightRadius: 31,
      borderBottomRightRadius: isExpanded ? 0 : 31, // 확장 시 0, 아니면 31
    }
  ];
  return (
    <View style={styles.wrapper}>
      <Swipeable
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
        //  슬라이드 열릴 때 borderRadius 0, 닫힐 때 31로 복원
        onSwipeableOpen={() => setRightRadius(0)}
        onSwipeableClose={() => setRightRadius(31)}
      >
        <View style={[
          styles.innerBox,
          expanded && isDial && styles.innerBoxExpanded,
          // 오른쪽 borderRadius를 동적으로 적용
          {
            borderTopRightRadius: rightRadius,
            borderBottomRightRadius: expanded ? 0 : rightRadius,
          }
        ]}>
          {isDial && (
            <TouchableOpacity style={styles.chevronBtn} onPress={() => setExpanded(e => !e)}>
              <Text style={styles.chevron}>{expanded ? "▼" : "▶"}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.headerRow}>
            <Image
              source={require('../../../../assets/device_icon.png')}
              style={styles.deviceIcon}
              resizeMode="contain"
            />

            <View style={styles.textArea}>
              {isEditing ? (
                <TextInput
                  style={styles.nameInput}
                  value={tempName}
                  onChangeText={setTempName}
                  autoFocus
                  onBlur={handleName}
                  onSubmitEditing={handleName}
                  returnKeyType="done"
                />
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={styles.deviceTitle}>{deviceName}</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity onPress={handlePress} disabled={loading}>
              <Image
                source={
                  pressed
                    ? require('../../../../assets/power_on.png')
                    : require('../../../../assets/power_off.png')
                }
                style={styles.powerBtn}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Swipeable>
      {isDial && expanded && (
        <View style={[styles.expandedBox]}>
          {/* 확장 시 보여질 내용 */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 20,
  },
  innerBox: {
    width: width * 0.85,
    height: height * 0.15,
    backgroundColor: "white",
    borderRadius: 31,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
    zIndex: 2,
    position: "relative",
  },
  innerBoxExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  chevronBtn: {
    position: "absolute",
    top: 2,
    right: 5,
    zIndex: 10,
    padding: 6,
  },
  chevron: {
    fontSize: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    height: "100%",
  },
  deviceIcon: {
    width: 80,
    height: 80,
    marginLeft: 10,
  },
  textArea: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 15,
  },
  deviceTitle: {
    fontWeight: "800",
    fontSize: 20,
    color: "#000",
    marginBottom: 30,
  },
  powerBtn: {
    width: 70,
    height: 70,
    marginLeft: 10,
  },
  expandedBox: {
    width: width * 0.85,
    height: height * 0.13,
    backgroundColor: "white",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 31,
    borderBottomRightRadius: 31,
    zIndex: 1,
    justifyContent: "center",
  },
  nameInput: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    borderBottomWidth: 1,
    borderColor: "#aaa",
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: height * 0.15,
    borderTopRightRadius: 31,
    borderBottomRightRadius: 31,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default DeviceBox;
