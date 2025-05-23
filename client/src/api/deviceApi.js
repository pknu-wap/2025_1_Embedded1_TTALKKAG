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
// 6) 디바이스 메모 작성 (PATCH)

export const saveDeviceMemo = async (deviceId, type, memo) => {
  const url = `${BASE_URL}/device/memo`;
  return axios.patch(url, {
    type,
    deviceId,
    memo
  }, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });
};

// 7) 다이얼 업다운 버튼 누르기기 (POST)
export const pressDialButoon = async (deviceId, command) => {
  const url = `${BASE_URL}/device/up-down`;
  return axios.post(url,{
      deviceId: deviceId,
      command: command
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    }
  );
};

// 8) 다이얼 스탭유닛 설정 (PATCH)
export const setDialStepUnit = async (deviceId, step) => {
  const url = `${BASE_URL}/device/step-unit`;
  return axios.patch(url,{
      deviceId: deviceId,
      step: step
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    }
  );
};
