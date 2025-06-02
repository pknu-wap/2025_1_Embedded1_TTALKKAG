import React, {  useRef,useEffect, useState } from "react";
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
  ImageBackground,
  Keyboard
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { pressDevice, changeDeviceName, deleteDevice,saveDeviceMemo,pressDialButoon,setDialStepUnit,scrollRef } from '../../../api/deviceApi';

const { width, height } = Dimensions.get("window");

const DeviceBox = ({ id, name, type, onDelete,memo ,onUpdateMemo,dialStep,stepUnit  }) => {
  
  
  const [expanded, setExpanded] = useState(false); // 다이얼 확장 여부

  // 이름 수정 관련 상태
  const [isEditing, setIsEditing] = useState(false); //이름 수정중인 모드
  const [deviceName, setDeviceName] = useState(name); // 현재 디바이스 이름
  const [tempName, setTempName] = useState(name); // 임시로 이름 입력값
  
  // 오른쪽 borderRadius: 스와이프시 변화
  const [rightRadius, setRightRadius] = useState(31);

  // 메모 관련 상태
  const [memoValue, setMemoValue] = useState(memo || '');  // 메모 입력값
  const [isEditingMemo, setIsEditingMemo] = useState(false); // 메모 수정모드

  // 다이얼 관련 상태 
  const [dialValue, setDialValue] = useState(dialStep);  //다이얼 값 
  const [isEditingStep, setIsEditingStep] = useState(false); //스텝 수정모드 
  const [step, setStep] = useState(stepUnit);  // 다이얼 스텝 값 
  const [isDialBusy, setIsDialBusy] = useState(false); // 업/다운 버튼 동작 중 여부

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
  
  // 중복 저장 방지용 ref
  const hasSavedName = useRef(false);
  const hasSavedMemo = useRef(false);

  // 이름 수정
const handleName = async () => {
  if (!isEditing) return; // 이미 편집 모드가 아니면 무시
  if (tempName.trim() === '') {
    setTempName(deviceName);
  } else if (tempName !== deviceName) {
    try {
      await changeDeviceName(id, type, tempName);
      setDeviceName(tempName);
    } catch (err) {
      setTempName(deviceName);
    }
  }
  setIsEditing(false); // 저장 끝나고 나서 닫기
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
              Alert.alert("삭제 실패");
              console.log("에러메시지", err.message)
            }
          }
        }
      ],
    );
  };
  
  // 스와이프시 삭제 버튼
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
    if (isDialBusy) return; 
    setIsDialBusy(true);
    try {
      await pressDialButoon(id, command);
      console.log(`요청 성공`);
      setDialValue((prev) => {
        if (command === "up") return Math.min(DIAL_MAX, prev + step);
        if (command === "down") return Math.max(DIAL_MIN, prev - step);
        return prev;
      });
    } catch (err) {
      Alert.alert("제어 실패");
      console.error(`실패:`, err.message, err.response?.data);
    }
    finally {
    setIsDialBusy(false); 
  }
  };

// 메모 저장 함수
const handleMemoSave = async () => {
  if (!isEditingMemo) return;
  try {
    await saveDeviceMemo(id, type, memoValue);
    onUpdateMemo?.(id, type, memoValue);
  } catch (err) {}
  setIsEditingMemo(false);
};
  
  // 다이얼변수 다이얼이면 토글창 보이게하기 위해서
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

  // 타입별 아이콘 
let iconSource;
if (type === "dial_actuator") {
  iconSource = require('../../../../assets/dial_icon.png');
} else if (type === "button_clicker") {
  iconSource = require('../../../../assets/button_icon.png');
} 
// 이름 입력 중 키보드 내려갈 때 자동 저장
useEffect(() => {
  if (!isEditing) return;
  const onKeyboardHide = () => {
    handleName();
  };
  const sub = Keyboard.addListener('keyboardDidHide', onKeyboardHide);
  return () => sub.remove();
}, [isEditing, tempName]);

// 메모 입력 중 키보드 내려갈 때 자동 저장
useEffect(() => {
  if (!isEditingMemo) return;
  const onKeyboardHide = () => {
    handleMemoSave();
  };
  const sub = Keyboard.addListener('keyboardDidHide', onKeyboardHide);
  return () => sub.remove();
}, [isEditingMemo, memoValue]);

  return (
    <View style={styles.wrapper}>
      {/* 스와이프 삭제 기능 */}
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
           {/* 다이얼이면 토글 버튼 */}
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
             {/* 디바이스 아이콘 영역 */}
          <View style={styles.headerRow}>
            <Image
              source={iconSource}
              style={styles.deviceIcon}
              resizeMode="contain"
            />

             {/* 디바이스 이름 영역 */}
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
                     onFocus={event => {
                scrollRef?.current?.scrollToFocusedInput?.(event.target);
              }}
                />
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={styles.deviceTitle} numberOfLines={1} ellipsizeMode="tail">{deviceName}</Text>
                </TouchableOpacity>
              )}
                 {/* 메모 입력/표시시 영역 */}
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
                            onFocus={event => {
                    scrollRef?.current?.scrollToFocusedInput?.(event.target);
                  }}
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
              {/* 전원 버튼 */}
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
      {/*  다이얼 확장 */}
      {isDial && expanded && (
  <View style={styles.expandedBox}>
    <View style={styles.dialRow}>
      {/*  다이얼 값 스텝 조정 박스 */}
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
         {/* 업다운 버튼 */}
      <View style={styles.dialButtonCol}>
       <TouchableOpacity
          style={[styles.dialBtn, dialValue + step > DIAL_MAX && styles.dialBtnDisabled]}
          onPress={() => handleDialButton("up")}
          disabled={dialValue + step > DIAL_MAX || isDialBusy}
        >
          <Image 
          source={require('../../../../assets/up.png')} 
          style={{ width: 100, height: 45, marginTop: 100, marginBottom: 10}}
          resizeMode="contain" />
        </TouchableOpacity>
      <TouchableOpacity
        style={[styles.dialBtn, dialValue - step < DIAL_MIN && styles.dialBtnDisabled]}
        onPress={() => handleDialButton("down")}
        disabled={dialValue - step < DIAL_MIN || isDialBusy} 
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
