package wap.ttalkkag.device;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wap.ttalkkag.domain.*;
import wap.ttalkkag.mqtt.MqttPublisherSevice;
import wap.ttalkkag.repository.*;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final UserRepository userRepository;
    private final ButtonRepository buttonRepository;
    private final DialRepository dialRepository;
    private final TriggerRepository triggerRepository;
    private final TriggerDeviceRepository triggerDeviceRepository;
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
            case "door_sensor", "remote" -> {
                TriggerDevice triggerDevice = triggerDeviceRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                triggerDevice.setName(newName);
                triggerDeviceRepository.save(triggerDevice);
            }
            default -> throw new IllegalArgumentException("Wrong device type");
        }
    }
    /*기기 삭제, 등록 해제 메시지 mqtt로 기기에 수신*/
    @Transactional
    public void deleteDevice(DeleteDeviceDTO request) {
        Long deviceId = request.getDeviceId();
        String type = request.getType();
        //device 제거 시 연결된 trigger 레코드 제거
        triggerRepository.deleteByIdDeviceIdAndIdDeviceType(deviceId, type);
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
            case "door_sensor", "remote" -> {
                TriggerDevice triggerDevice = triggerDeviceRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                clientId = triggerDevice.getClientId();
                triggerDeviceRepository.delete(triggerDevice);
            }
            default -> throw new IllegalArgumentException("Wrong device type");
        }
        String topic = "server/disconnect/" + type + "/" + clientId;
        String payload = "";
        /*연결 해제 메시지 발행*/
        mqttPublisherSevice.publish(topic, payload);
    }
    /*기기 메모 작성*/
    public void patchDeviceMemo(PatchDeviceMemoDTO request) {
        Long deviceId = request.getDeviceId();
        String type = request.getType();
        String memo = request.getMemo();
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
            case "door_sensor", "remote" -> {
                TriggerDevice triggerDevice = triggerDeviceRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                triggerDevice.setMemo(memo);
                triggerDeviceRepository.save(triggerDevice);
            }
        }
    }
    /*다이얼 step unit 설정*/
    public void changeDialStepUnit(PatchDialMaxStepDTO request) {
        Integer newStepUnit = request.getStep();
        Dial dial = dialRepository.findById(request.getDeviceId()).orElseThrow(() -> new RuntimeException("Device not found"));
        /*갱신이 이루어질 때만 DB 갱신 & MQTT 통신*/
        if (newStepUnit != dial.getStepUnit()) {
            dial.setStepUnit(newStepUnit);
            /*스텝 유닛 변경 시, 현재 스텝 0으로 초기화
             * 일관성을 위함*/
            dial.setStep(0);
            dialRepository.save(dial);

            /*스텝 유닛 변경 내용을 디바이스에 알림*/
            String clientId = dial.getClientId();
            String topic = "server/step/dial_actuator/" + clientId;
            String payload = String.format("{\"stepUnit\": %d}", newStepUnit);
            mqttPublisherSevice.publish(topic, payload);
        }
    }
    /*다이얼 원격 조정 Up, Down, Press*/
    public void remoteDial(RemoteDialDTO request) {
        Dial dial = dialRepository.findById(request.getDeviceId()).orElseThrow(() -> new RuntimeException("Device not found"));
        String command = request.getCommand();
        boolean updated = false;
        /*다음 스텝이 0 이상 100 이하 일때만 DB 갱신 및 통신*/
        switch(command) {
            case "up" -> {
                int nextStep = dial.getStep() + dial.getStepUnit();
                if (nextStep <= 100) {
                    dial.setStep(nextStep);
                    updated = true;
                }
            }
            case "down" -> {
                int nextStep = dial.getStep() - dial.getStepUnit();
                if (nextStep >= 0) {
                    dial.setStep(nextStep);
                    updated = true;
                }
            }
            case "press" -> {
                String topic = "server/action/dial_actuator/" + dial.getClientId();
                String payload = "press!";
                mqttPublisherSevice.publish(topic, payload);
            }
            default -> throw new IllegalArgumentException("Invalid command");
        }
        /*DB에 갱신이 있는 경우에 기기에 송신*/
        if (updated) {
            dialRepository.save(dial);
            String topic = "server/" + command + "/dial_actuator/" + dial.getClientId();
            String payload = "action!";
            mqttPublisherSevice.publish(topic, payload);
        }
    }
}
