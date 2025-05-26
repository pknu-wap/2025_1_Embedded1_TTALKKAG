import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.API_URL;

//트리거 목록 불러오기
export const fetchTriggerLists = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trigger-lists`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('목록 불러오기 실패:', error);
    return [];
  }
};

// 트리거 디바이스박스 불러오기
export const fetchTriggerDevices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trigger-devices`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('디바이스 목록 불러오기 실패:', error);
    return [];
  }
};
// 목록,디바이스박스 이름 변경 
export const renameDevice = async ({ type, deviceId, newName }) => {
  try {
    const response = await axios.post(`${BASE_URL}/device-rename`, {
      type,
      deviceId,
      newName
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('이름 변경 실패:', error);
    throw error;
  }
};

//목록 삭제 
export const deleteTriggerList = async ({ type, deviceId }) => {
  try {
    const response = await axios.post(`${BASE_URL}/triggerlist-delete`, {
      type,
      deviceId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error("목록 삭제 실패:", error);
    throw error;
  }
};
