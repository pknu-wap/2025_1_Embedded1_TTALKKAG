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
import { pressDevice, changeDeviceName, deleteDevice,saveDeviceMemo,pressDialButoon,setDialStepUnit } from '../../../api/deviceApi';

const { width, height } = Dimensions.get("window");

const DeviceBox = ({ id, name, type, onDelete,memo ,onUpdateMemo,dialStep,stepUnit  }) => {
  const [expanded, setExpanded] = useState(false);

  // 이름 수정 관련 상태
  const [isEditing, setIsEditing] = useState(false);
  const [deviceName, setDeviceName] = useState(name);
  const [tempName, setTempName] = useState(name);
  
  // 오른쪽 borderRadius 
  const [rightRadius, setRightRadius] = useState(31);

  const [memoValue, setMemoValue] = useState(memo || '');
  const [isEditingMemo, setIsEditingMemo] = useState(false);

  const [dialValue, setDialValue] = useState(dialStep); 
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [step, setStep] = useState(stepUnit); 
  const DIAL_MIN = 0;
  const DIAL_MAX = 100;

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
  // 다이얼 업다운 조정 통신
  const handleDialButton = async (command) => {
  try {
    await pressDialButoon(id, command);
    console.log(`요청 성공`);
    setDialValue((prev) => {
      if (command === "up") return Math.min(DIAL_MAX, prev + step);
      if (command === "down") return Math.max(DIAL_MIN, prev - step);
      return prev;
    });
  } catch (err) {
    Alert.alert("다이얼 제어 실패");
    console.error(`실패:`, err.message, err.response?.data);
  }
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

let iconSource;
if (type === "dial_actuator") {
  iconSource = require('../../../../assets/dial_icon.png');
} else if (type === "button_clicker") {
  iconSource = require('../../../../assets/button_icon.png');
} 

<Image
  source={iconSource}
  style={styles.deviceIcon}
  resizeMode="contain"
/>

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
            <TouchableOpacity style={styles.toggleBtn} onPress={() => setExpanded(e => !e)}>
              <Image
                source={
                  expanded
                    ? require('../../../../assets/toggle-down.png')
                    : require('../../../../assets/toggle-right.png')
                }
                style={styles.toggleImage}
              />
            </TouchableOpacity>
          )}

          <View style={styles.headerRow}>
            <Image
              source={iconSource}
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
    <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => setIsEditingStep(true)}
    style={{ borderRadius: 12, overflow: "hidden" }}
  >
  <ImageBackground
    source={require('../../../../assets/dial_bg.png')}
    style={{ width: 240, height: 100, justifyContent: "center", marginLeft:30 }}
    imageStyle={{ borderRadius: 10 }}
  >
    {isEditingStep ? (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>스텝조정:</Text>
          <TextInput
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#222",
              width: 60,
              borderBottomWidth: 1,
              borderColor: "#4999BA",
              textAlign: "center"
            }}
            value={step === "" ? "" : String(step)}
            keyboardType="number-pad"
            maxLength={2}
            autoFocus
            onChangeText={txt => {
              const onlyNum = txt.replace(/[^0-9]/g, "");
              if (onlyNum === "") {
                setStep("");
                return;
              }
              let num = Number(onlyNum);
              if (num < 1) num = 1;
              if (num > 50) num = 50;
              setStep(num);
            }}
           onBlur={async () => {
            // 입력값 보정
            let sendStep = step;
            if (sendStep === "" || Number(sendStep) < 1) sendStep = 1;
            if (Number(sendStep) > 50) sendStep = 50;
            setStep(sendStep);

            try {
              await setDialStepUnit(id, Number(sendStep));
              setDialValue(0); //0으로 초기화
              console.log("스텝 유닛 설정 성공");
            } catch (err) {
              Alert.alert("스텝 유닛 설정 실패");
              console.error("스텝 유닛 실패:", err.message, err.response?.data);
            }
            setIsEditingStep(false);
          }}

          />
        </View>
      ) : (
       <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Text style={styles.dialValueText}>{dialValue}</Text>
          <Text style={styles.dialValueText}> / {DIAL_MAX}</Text>
        </View>
      )}
  </ImageBackground>
  </TouchableOpacity>
</View>
      <View style={styles.dialButtonCol}>
       <TouchableOpacity
          style={[styles.dialBtn, dialValue + step > DIAL_MAX && styles.dialBtnDisabled]}
          onPress={() => handleDialButton("up")}
          disabled={dialValue + step > DIAL_MAX}
        >
          <Image 
          source={require('../../../../assets/up.png')} 
          style={{ width: 100, height: 45, marginTop: 100, marginBottom: 10}}
          resizeMode="contain" />
        </TouchableOpacity>
      <TouchableOpacity
        style={[styles.dialBtn, dialValue - step < DIAL_MIN && styles.dialBtnDisabled]}
        onPress={() => handleDialButton("down")}
        disabled={dialValue - step < DIAL_MIN}
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
  toggleBtn: {
    position: "absolute",
    top: 20,
    right: 10,
  },
  toggleImage: {
  width: 18,  
  height: 18,
  resizeMode: 'contain',
},

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    height: "100%",
  },
  deviceIcon: {
    width: 65,
    height: 65,
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
    marginTop: 1,
    
  },
  powerBtn: {
    width: 70,
    height: 70,
    marginLeft: 10,
  },
  expandedBox: {
    width: width * 0.85,
    height: height * 0.18,
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
    marginTop: 10,
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
    marginLeft: 10
  },

  dialBtnDisabled: {
    opacity: 0.3,
  },

  
});

export default DeviceBox;
