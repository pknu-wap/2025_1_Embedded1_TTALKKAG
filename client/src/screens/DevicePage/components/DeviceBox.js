import React, { useEffect, useState } from "react";
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
  ImageBackground
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { pressDevice, changeDeviceName, deleteDevice,saveDeviceMemo } from '../../../api/deviceApi';

const { width, height } = Dimensions.get("window");

const DeviceBox = ({ id, name, type, onDelete,memo ,onUpdateMemo  }) => {
  const [expanded, setExpanded] = useState(false);

  const [isEditingDial, setIsEditingDial] = useState(false);

  // 이름 수정 관련 상태
  const [isEditing, setIsEditing] = useState(false);
  const [deviceName, setDeviceName] = useState(name);
  const [tempName, setTempName] = useState(name);
  
  // 오른쪽 borderRadius 
  const [rightRadius, setRightRadius] = useState(31);

  const [memoValue, setMemoValue] = useState(memo || '');
  const [isEditingMemo, setIsEditingMemo] = useState(false);

  const [dialValue, setDialValue] = useState(4); // 초기값 4, 1~7 사이
  const DIAL_MIN = 1;
  const DIAL_MAX = 7;

  // 전원 버튼
  const handlePress = async () => {
    try {
      await pressDevice(id);
      console.log("전원버튼 요청 성공")
    } catch (err) {
      Alert.alert("제어 실패");
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
        console.log("이름변경 성공")

        setDeviceName(tempName);
      } catch (err) {
        console.log("이름 변경 실패:", err.message, err.response?.data);

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
  // 메모 저장 api
  const handleMemoSave = async () => {
    setIsEditingMemo(false);
    try {
      await saveDeviceMemo(id, type, memoValue);
      console.log("메모 저장 성공");
      onUpdateMemo?.(id,type, memoValue); // 부모에게 변경 알림
    } catch (err) {
      console.error("메모 저장 실패:", err.message, err.response?.data);
    }
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
                  onBlur={handleName}
                  returnKeyType="done"
                  borderBottomWidth={0}
                  maxLength={15}
                />
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={styles.deviceTitle} numberOfLines={1} ellipsizeMode="tail">{deviceName}</Text>
                </TouchableOpacity>
              )}
                 {/* 메모 입력/표시 영역 */}
                  <View style={styles.memoRow}>
                    {isEditingMemo ? (
                      <>
                        <TextInput
                          style={styles.memoInput}
                          value={memoValue}
                          onChangeText={setMemoValue}
                          placeholder="메모를 입력하세요."
                          maxLength={20}
                          underlineColorAndroid="transparent"
                          returnKeyType="done"
                          onBlur={handleMemoSave}
                          onSubmitEditing={handleMemoSave}
                          autoFocus
                        />
                        <Image
                          source={require("../../../../assets/pencil_icon.png")}
                          style={styles.memoIcon}
                        />
                      </>
                    ) : (
                      <TouchableOpacity
                        style={styles.memoDisplay}
                        onPress={() => setIsEditingMemo(true)}

                      >
                        <Text
                          style={[
                            styles.memoText,
                            memo ? styles.memoTextFilled : styles.memoTextPlaceholder,
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {memo ? memo : "메모를 입력하세요."}
                        </Text>
                        <Image
                          source={require("../../../../assets/pencil_icon.png")}
                          style={styles.memoIcon}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

            <TouchableOpacity onPress={handlePress}>
              <Image
                source={require('../../../../assets/power_on.png')}
                style={styles.powerBtn}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Swipeable>
      {isDial && expanded && (
  <View style={styles.expandedBox}>
    <View style={styles.dialRow}>
    <View style={styles.dialValueBox}>
  <ImageBackground
    source={require('../../../../assets/dial_bg.png')}
    style={{ width: 250, height: 95, justifyContent: "center", borderRadius: 12, marginLeft:30 }}
    imageStyle={{ borderRadius: 10 }}
  >
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      {isEditingDial ? (
        <TextInput
          style={{
            fontSize: 36,
            fontWeight: "bold",
            color: "#222",
          }}
          value={String(dialValue)}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={text => {
            // 숫자만 남기고, 빈 문자열 허용
            const onlyNum = text.replace(/[^0-9]/g, "");
            if (onlyNum === "") {
              setDialValue(""); // 비울 수 있게
            } else {
              const num = Number(onlyNum);
              if (num >= DIAL_MIN && num <= DIAL_MAX) {
                setDialValue(num);
              }
            }
          }}
          
          onBlur={() => setIsEditingDial(false)}
          autoFocus
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setIsEditingDial(true)}>
            <Text style={styles.dialValueText}>{dialValue}</Text>
          </TouchableOpacity>
          <Text style={styles.dialValueText}> / {DIAL_MAX}</Text>
        </>
      )}
    </View>
  </ImageBackground>
</View>
      <View style={styles.dialButtonCol}>
        <TouchableOpacity
          style={[styles.dialBtn, dialValue === DIAL_MAX && styles.dialBtnDisabled]}
          onPress={() => setDialValue(v => Math.min(DIAL_MAX, v + 1))}
          disabled={dialValue === DIAL_MAX}
        >
          <Image 
          source={require('../../../../assets/up.png')} 
          style={{ width: 100, height: 45, marginTop: 100, marginBottom: 3}}
          resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dialBtn, dialValue === DIAL_MIN && styles.dialBtnDisabled]}
          onPress={() => setDialValue(v => Math.max(DIAL_MIN, v - 1))}
          disabled={dialValue === DIAL_MIN}
        >
          <Image 
          source={require('../../../../assets/down.png')}
          style={{ width: 100, height: 45, marginBottom: 45 }}
          resizeMode="contain"/>
        </TouchableOpacity>
      </View>
    </View>
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
    height: height * 0.18,
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
    width: 60,
    height: 60,
    marginLeft: 10,
  },
  textArea: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 15,
  },
  deviceTitle: {
    fontWeight: "800",
    fontSize: 19,
    color: "#4999BA",
    marginTop: 10,
    
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
    fontSize: 19,
    fontWeight: "800",
    borderBottomWidth: 0,
    padding: 0,
    margin: 0,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
    height: height * 0.18,
    borderTopRightRadius: 31,
    borderBottomRightRadius: 31,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  memoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  memoDisplay: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  memoText: {
    fontSize: 13,
    fontWeight: 800,
    marginRight: 4,
    flexShrink: 1,
  },
  memoTextPlaceholder: {
    color: "#b0b0b0",
  },
  memoTextFilled: {
   
  },
  memoIcon: {
    width: 14,
    height: 14,
    tintColor: "#b0b0b0",
  },
  memoInput: {
    fontSize: 13,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 0,
    margin: 0,
    flex: 1,
    alignSelf: "flex-start",
  
  },
  dialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  dialValueBox: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  dialValueText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#222",
  },
  dialButtonCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  dialBtnDisabled: {
    opacity: 0.3,
  },

  
});

export default DeviceBox;
