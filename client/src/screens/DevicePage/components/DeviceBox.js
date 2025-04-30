import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput
} from "react-native";
import { pressDevice } from '../../../api/deviceApi';
import { changeDeviceName } from '../../../api/deviceApi';

const { width, height } = Dimensions.get("window");

// DeviceBox 컴포넌트 정의
const DeviceBox = ({ id, name, type }) => {
  const [expanded, setExpanded] = useState(false);  // 다이얼 디바이스의 확장 상태
  const [loading, setLoading] = useState(false);    // API 요청 중 로딩 여부
  const [pressed, setPressed] = useState(false);    // 디바이스 상태 (전원 ON/OFF)

  // 이름 수정 관련 상태
  const [isEditing, setIsEditing] = useState(false);        // 이름을 수정 중인지 여부 (true면 TextInput 노출)
  const [deviceName, setDeviceName] = useState(name);       // 현재 디바이스 이름 (화면에 보여질 이름)
  const [tempName, setTempName] = useState(name);           // 임시 입력용 이름 (TextInput에 입력 중인 값)

  // 전원 버튼 누를 때 실행되는 함수
  const handlePress = async () => {
    setPressed(prev => !prev);       // 먼저 UI를 반응시킴
    setLoading(true);                // 버튼 비활성화를 위한 로딩 표시
    try {
      const res = await pressDevice(id);  // 서버에 버튼 누르기 요청
      console.log("pressDevice 응답:", res?.data);
    } catch (err) {
      console.error("제어 실패:", err);
      setPressed(prev => !prev);     // 실패 시 이전 상태로 되돌리기
    } finally {
      setLoading(false);
    }
  };
  // 이름 수정 완료 시 처리 함수 (포커스 해제 또는 엔터 입력 시 호출)
   const handleName = async () => {
    if (tempName.trim() === '') {
      setTempName(deviceName);                
      setIsEditing(false);                     
      return;                                 
    }

    setIsEditing(false); // 입력 모드 종료
    if (tempName !== deviceName) { // 이름이 실제로 변경되었을 경우만 API 호출
      try {
        // 서버에 디바이스 이름 변경 요청
        const res = await changeDeviceName(id, type, tempName);
        // 성공 시 실제 이름 상태값 변경
        setDeviceName(tempName);
        console.log("이름 변경 성공");
      } catch (err) {
        console.error("이름 변경 실패");
        setTempName(deviceName); // 실패 시 원래 이름 복원
      }
    }
  };
  const isDial = type === "dial";  // 다이얼 타입 디바이스 여부 확인

  return (
    <View style={styles.wrapper}>
      <View style={[styles.innerBox, expanded && isDial && styles.innerBoxExpanded]}>
        {/* 확장 버튼 (다이얼일 때만 표시됨) */}
        {isDial && (
          <TouchableOpacity style={styles.chevronBtn} onPress={() => setExpanded(e => !e)}>
            <Text style={styles.chevron}>{expanded ? "▼" : "▶"}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.headerRow}>
        {/* 디바이스 아이콘 */}
          <Image
            source={require('../../../../assets/device_icon.png')}
            style={styles.deviceIcon}
            resizeMode="contain"
          />
        {/* 디바이스 이름*/}
        <View style={styles.textArea}>
            {isEditing ? (
              // 수정할 때는 TextInput을 보여줌
              <TextInput
                style={styles.nameInput}
                value={tempName} // 현재 입력 중인 이름 (임시 상태)
                onChangeText={setTempName} // 입력값 변경 시 상태 업데이트
                autoFocus   // 자동으로 포커스
                onBlur={handleName}  // 포커스 해제되면 이름 저장 시도
                onSubmitEditing={handleName} // 키보드에서 '완료' 누르면 저장
                returnKeyType="done" // 키보드에 '완료' 버튼 표시
              />
            ) : (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.deviceTitle}>{deviceName}</Text>
              </TouchableOpacity>
            )}
          </View>
        {/* 전원 버튼 disabled prop은 api요청도중에 중복터치가 안되게 로딩중에 잠금 */}
          <TouchableOpacity onPress={handlePress} disabled={loading}>
            <Image
              source={pressed
                ? require('../../../../assets/power_on.png')
                : require('../../../../assets/power_off.png')}
              style={[styles.powerBtn]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 확장 영역 (다이얼 디바이스일 때만 표시) */}
      {isDial && expanded && (
        <View style={styles.expandedBox}>
        </View>
      )}
    </View>
  );
};

// 스타일 정의
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
});

export default DeviceBox;
