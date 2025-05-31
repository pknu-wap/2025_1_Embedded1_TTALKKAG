import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.API_URL;

//기기 목록 불러오기
export const fetchDeviceList = async () => {
  const url = `${BASE_URL}/device/list`;
  return axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });
};

//트리거 목록 불러오기 (GET)
export const fetchTriggerLists = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trigger/list`, {
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

//트리거에 속한 디바이스 목록 불러오기 (GET)
export const fetchTriggerDevices = async (doorId) => {
  try {
    const response = await axios.get(`${BASE_URL}/trigger/${doorId}/active-devices`, {
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

//디바이스 박스 활성화 (POST)
export const activateDeviceBox = async (triggerDeviceId, deviceId, deviceType) => {
  const url = `${BASE_URL}/trigger/activate`;
  return axios.post(url, {
    triggerDeviceId,
    deviceId,
    deviceType
  }, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });
};

//디바이스 박스 비활성화 (DELETE)
export const deactivateDeviceBox = async (payload) => {
  return await axios.delete(`${BASE_URL}/trigger/deactivate`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    data: payload
  });
};

//디바이스 이름 변경 (PATCH)
export const changeDeviceName = async (deviceId, type, newName) => {
  const url = `${BASE_URL}/device/change-name`;
  try {
    const response = await axios.patch(url, {
      type,
      deviceId,
      newName
    }, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('디바이스 이름 변경 실패:', error);
    throw error;
  }
};

//목록 이름변경 ( PATCH )
export const changeListName = async (deviceId, type, newName) => {
  const url = `${BASE_URL}/device/change-name`;
  try {
    const response = await axios.patch(url, {
      deviceId,
      type,
      newName
    }, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('목록 이름 변경 실패:', error);
    throw error;
  }
};

//목록 삭제 (DELETE)
export const deleteDevice = async (payload) => {
  try {
    const response = await axios.delete(`${BASE_URL}/device/delete`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      data: payload
    });
    return response.data;
  } catch (error) {
    console.error("목록 삭제 실패:", error);
    throw error;
  }
};

export const TriggerDevices = async (doorId) => {
  const url = `${BASE_URL}/trigger/devices?doorId=${doorId}`;
  try {
    const response = await axios.get(url);
    console.log(`[API] listId ${doorId} 응답:`, response.data); // ✅ 응답 로그 출력
    return response.data;
  } catch (error) {
    console.error(`[API] listId ${doorId} 디바이스 요청 실패:`, error);
    return [];
  }
};