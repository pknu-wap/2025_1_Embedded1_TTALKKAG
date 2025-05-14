package wap.ttalkkag.device;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.stereotype.Service;
import wap.ttalkkag.domain.Button;
import wap.ttalkkag.domain.Dial;
import wap.ttalkkag.domain.Door;
import wap.ttalkkag.domain.User;
import wap.ttalkkag.mqtt.MqttPublisherSevice;
import wap.ttalkkag.mqtt.MqttService;
import wap.ttalkkag.repository.ButtonRepository;
import wap.ttalkkag.repository.DialRepository;
import wap.ttalkkag.repository.DoorRepository;
import wap.ttalkkag.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final UserRepository userRepository;
    private final ButtonRepository buttonRepository;
    private final DialRepository dialRepository;
    private final DoorRepository doorRepository;
    private final MqttPublisherSevice mqttPublisherSevice;

    /*해당 userId에 연관된 디바이스 목록을 가져옴*/
    public User getRegisteredDevices(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    /*device의 이름을 변경*/
    public void updateDeviceName(ChangeDeviceSettingDTO request) {
        Long deviceId = request.getDeviceId();
        String newName = request.getNewName();
        switch (request.getType()) {
            case "button_clicker" -> {
                Button button = buttonRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                button.setName(newName);
                buttonRepository.save(button);
            }
            case "dial_actuator" -> {
                Dial dial = dialRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                dial.setName(newName);
                dialRepository.save(dial);
            }
            case "door_sensor" -> {
                Door door = doorRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                door.setName(newName);
                doorRepository.save(door);
            }
            default -> throw new IllegalArgumentException("Wrong device type");
        }
    }
    /*기기 삭제, 등록 해제 메시지 mqtt로 기기에 수신*/
    public void deleteDevice(DeleteDeviceDTO request) {
        Long deviceId = request.getDeviceId();
        String type = request.getType();
        String clientId;
        switch(type) {
            case "button_clicker" -> {
                Button button = buttonRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                clientId = button.getClientId();
                buttonRepository.delete(button);
            }
            case "dial_actuator" -> {
                Dial dial = dialRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                clientId = dial.getClientId();
                dialRepository.delete(dial);
            }
            case "door_sensor" -> {
                Door door = doorRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                clientId = door.getClientId();
                doorRepository.delete(door);
            }
            default -> throw new IllegalArgumentException("Wrong device type");
        }
        String topic = "server/disconnect/" + type + "/" + clientId;
        String payload = "";
        /*연결 해제 메시지 발행*/
        mqttPublisherSevice.publish(topic, payload);
    }
    /*기기 메모 작성*/
    public void patchDevicememo(PatchDeviceMemoDTO request) {
        Long deviceId = request.getDeviceId();
        String type = request.getType();
        String memo = request.getMemo();;
        switch(type) {
            case "button_clicker" -> {
                Button button = buttonRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                button.setMemo(memo);
                buttonRepository.save(button);
            }
            case "dial_actuator" -> {
                Dial dial = dialRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                dial.setMemo(memo);
                dialRepository.save(dial);
            }
            case "door_sensor" -> {
                Door door = doorRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                door.setMemo(memo);
                doorRepository.save(door);
            }
        }
    }
}
