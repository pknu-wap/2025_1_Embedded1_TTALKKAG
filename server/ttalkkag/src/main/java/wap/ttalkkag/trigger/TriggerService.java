package wap.ttalkkag.trigger;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wap.ttalkkag.domain.*;
import wap.ttalkkag.mqtt.MqttPublisherSevice;
import wap.ttalkkag.repository.ButtonRepository;
import wap.ttalkkag.repository.DialRepository;
import wap.ttalkkag.repository.DoorRepository;
import wap.ttalkkag.repository.TriggerRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TriggerService {
    private final DoorRepository doorRepository;
    private final TriggerRepository triggerRepository;
    private final ButtonRepository buttonRepository;
    private final DialRepository dialRepository;
    private final MqttPublisherSevice mqttPublisherSevice;

    /*user의 door_sensor 목록*/
    public List<Door> getTriggers(Long userId) {
        return doorRepository.findByUserId(userId);
    }
    /*특정 트리거가 동작하면 함께 동작할 디바이스 목록*/
    public List<Trigger> getActiveDevices(Long triggerId) {
        return triggerRepository.findByIdDoorId(triggerId);
    }
    /*트리거에 기기 추가(활성화) */
    public void activateDevice(ActivateDeviceDTO request) {
        Long doorId = request.getDoorId();
        Long deviceId = request.getDeviceId();
        String deviceType = request.getDeviceType();

        TriggerId triggerId = new TriggerId();
        triggerId.setDoorId(doorId);
        triggerId.setDeviceId(deviceId);
        triggerId.setDeviceType(deviceType);

        Trigger trigger = new Trigger();
        trigger.setId(triggerId);

        triggerRepository.save(trigger);

        /*디바이스에게 해당 트리거 내에서 활성화 되었다는 메시지 발행*/
        String clientId = findDeviceClientId(deviceType, deviceId);
        String topic = "server/subscribe/" + deviceType + "/" + clientId;

        activationMqttPublish(topic, doorId);
    }
    /*트리거에서 기기 제외(비활성화)*/
    public void deactivateDevice(ActivateDeviceDTO request) {
        Long doorId = request.getDoorId();
        Long deviceId = request.getDeviceId();
        String deviceType = request.getDeviceType();

        TriggerId triggerId = new TriggerId();
        triggerId.setDoorId(doorId);
        triggerId.setDeviceId(deviceId);
        triggerId.setDeviceType(deviceType);

        if (triggerRepository.existsById(triggerId)) {
            triggerRepository.deleteById(triggerId);

            /*디바이스에게 해당 트리거 내에서 비활성화 되었다는 메시지 발행*/
            String clientId = findDeviceClientId(deviceType, deviceId);
            String topic = "server/unsubscribe/" + deviceType + "/" + clientId;

            activationMqttPublish(topic, doorId);
        } else {
            throw new EntityNotFoundException("Trigger not found");
        }
    }
    /*디바이스의 클라이언트 ID를 찾는 메서드*/
    public String findDeviceClientId(String deviceType, Long deviceId) {
        return switch (deviceType) {
            case "button_clicker" -> {
                Button button = buttonRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                yield button.getClientId();
            }
            case "dial_actuator" -> {
                Dial dial = dialRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                yield  dial.getClientId();
            }
            default -> throw new IllegalArgumentException("Wrong Device Type");
        };
    }

    public void activationMqttPublish (String topic, Long doorId) {
        Door door = doorRepository.findById(doorId)
                .orElseThrow(() -> new RuntimeException("Door not found"));
        String triggerType = "door_sensor";
        String triggerClientId = door.getClientId();
        String payload = String.format("{\"clientType\": \"%s\", \"clientId\": \"%s\"}", triggerType, triggerClientId );
        mqttPublisherSevice.publish(topic, payload);
    }
}
