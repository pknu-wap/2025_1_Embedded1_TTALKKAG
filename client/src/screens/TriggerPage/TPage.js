import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import Background from "./components/Background.js";
import { AppText, styles as appTextStyles } from "./components/AppText.js";
import { TriggerList, styles as TriggerListStyles } from "./components/TriggerList.js";

const TPage = () => {
  const lists = ["목록1", "목록2", "목록3","목록4","목록5","목록6"];
  const [selectedIndex, setSelectedIndex] = useState(0); // 기본값을 첫 번째로 선택

  const handleListPress = (index) => {
    setSelectedIndex(index);
  };

  return (
    <View style={{ flex: 1 }}>
      <Background />
      <AppText style={appTextStyles.text1}>TTALKKACK</AppText>
      <AppText style={appTextStyles.text3}>Trigger</AppText>
      <AppText style={appTextStyles.text2}>트리거 페이지</AppText>

      {/* 목록 버튼 가로 스크롤 */}
      <View style={{ height: 60, marginTop: 50 }}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        
      >
        {lists.map((item, index) => {
          const isSelected = selectedIndex === index;
          return (
            <TouchableOpacity key={index} onPress={() => handleListPress(index)}>
              <TriggerList
                style={[
                  TriggerListStyles.baseItem,
                  isSelected && TriggerListStyles.selectedListItem
                ]}
                textStyle={TriggerListStyles.listText}
              >
                {item}
              </TriggerList>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      </View>
     
    </View>
  );
};

export default TPage;
