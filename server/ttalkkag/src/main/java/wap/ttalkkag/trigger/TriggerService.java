package wap.ttalkkag.trigger;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wap.ttalkkag.domain.*;
import wap.ttalkkag.mqtt.MqttPublisherSevice;
import wap.ttalkkag.repository.ButtonRepository;
import wap.ttalkkag.repository.DialRepository;
import wap.ttalkkag.repository.TriggerDeviceRepository;
import wap.ttalkkag.repository.TriggerRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TriggerService {
    private final TriggerDeviceRepository triggerDeviceRepository;
    private final TriggerRepository triggerRepository;
    private final ButtonRepository buttonRepository;
    private final DialRepository dialRepository;
    private final MqttPublisherSevice mqttPublisherSevice;

    /*user의 trigger device 목록*/
    public List<TriggerDevice> getTriggers(Long userId) {
        return triggerDeviceRepository.findByUserId(userId);
    }
    /*특정 트리거가 동작하면 함께 동작할 디바이스 목록*/
    public List<Trigger> getActiveDevices(Long triggerId) {
        return triggerRepository.findByIdTriggerDeviceId(triggerId);
    }
    /*트리거에 기기 추가(활성화) */
    public void activateDevice(ActivateDeviceDTO request) {
        TriggerId triggerId = createTriggerId(request);
        //트리거 디바이스 조회
        TriggerDevice triggerDevice = triggerDeviceRepository.findById(request.getTriggerDeviceId()).orElseThrow(() -> new RuntimeException("TriggerDevice not found"));

        Trigger trigger = new Trigger();
        trigger.setId(triggerId);
        trigger.setTriggerDevice(triggerDevice);

        triggerRepository.save(trigger);

        /*디바이스에게 해당 트리거 내에서 활성화 되었다는 메시지 발행*/
        String clientId = findDeviceClientId(request.getDeviceType(), request.getDeviceId());
        String topic = "server/subscribe/" + request.getDeviceType() + "/" + clientId;

        activationMqttPublish(topic, request.getTriggerDeviceId());
    }
    /*트리거에서 기기 제외(비활성화)*/
    public void deactivateDevice(ActivateDeviceDTO request) {
        TriggerId triggerId = createTriggerId(request);

        if (triggerRepository.existsById(triggerId)) {
            triggerRepository.deleteById(triggerId);

            /*디바이스에게 해당 트리거 내에서 비활성화 되었다는 메시지 발행*/
            String clientId = findDeviceClientId(request.getDeviceType(), request.getDeviceId());
            String topic = "server/unsubscribe/" + request.getDeviceType() + "/" + clientId;

            activationMqttPublish(topic, request.getTriggerDeviceId());
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

    public void activationMqttPublish (String topic, Long triggerDeviceId) {
        TriggerDevice triggerDevice = triggerDeviceRepository.findById(triggerDeviceId)
                .orElseThrow(() -> new RuntimeException("Trigger device not found"));
        String triggerType = triggerDevice.getTriggerType();
        String triggerClientId = triggerDevice.getClientId();
        String payload = String.format("{\"clientType\": \"%s\", \"clientId\": \"%s\"}", triggerType, triggerClientId );
        mqttPublisherSevice.publish(topic, payload);
    }
    private TriggerId createTriggerId(ActivateDeviceDTO request) {
        Long triggerDeviceId = request.getTriggerDeviceId();
        Long deviceId = request.getDeviceId();
        String deviceType = request.getDeviceType();

        TriggerId triggerId = new TriggerId();
        triggerId.setTriggerDeviceId(triggerDeviceId);
        triggerId.setDeviceId(deviceId);
        triggerId.setDeviceType(deviceType);

        return triggerId;
    }
}
