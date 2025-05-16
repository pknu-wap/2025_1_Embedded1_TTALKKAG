import React from "react";
import { Text, StyleSheet } from "react-native";

const TriggerList = ({ children, style }) => {
  return <Text  style={style}> {children}</Text>;
};
const styles= StyleSheet.create({
  listText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginTop: 64,
    marginLeft: 40,
  },
  selectedListItem: {
  backgroundColor: "#F3F8F7",
  padding: 12,           
  marginHorizontal: 8,   
  borderRadius: 50, // 테두리 원형
  borderWidth: 1,   // 테두리 두께
  borderColor: "rgba(0, 0, 0, 0.1)", // 테두리 색상 설정.
  width: 100,       
  height: 45,
  justifyContent: "center", // 가운데 정렬.
  alignItems: "center",    
  marginTop: 64,
  marginLeft: 20,
  elevation: 7,
},
listTextOnly: {
    // 클릭되지 않은 기본 스타일
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
})
export { TriggerList, styles };