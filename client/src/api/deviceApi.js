import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.API_URL;

// 기기 등록 (POST)
export const registerDevice = async () => {
  const url = `${BASE_URL}/mqtt/new-device`;
  return axios.post(url, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });
};

// 2) 기기 목록 불러오기 (GET)
export const fetchDeviceList = async () => {
  const url = `${BASE_URL}/device/list`;
  return axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });
};
// 3) 전원버튼 누르기 (POST)
export const pressDevice = async (deviceId) => {
  const url = `${BASE_URL}/mqtt/${deviceId}/press`;
  return axios.post(url, null, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });
};

// 4) 디바이스 이름 변경 (PATCH)
export const changeDeviceName = async (deviceId, type, newName) => {
  const url = `${BASE_URL}/device/change-name`;
  return axios.patch(url, {
    deviceId,
    type,
    newName
  }, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });
};
// 5) 디바이스 삭제 (DELETE)

export const deleteDevice = async (payload) => {
  return await axios.delete(`${BASE_URL}/device/delete`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    data: payload
  });
};
