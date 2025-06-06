package wap.ttalkkag.mqtt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wap.ttalkkag.domain.*;
import wap.ttalkkag.repository.*;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


/*Mqtt 콜백 인터페이스*/
@Service
public class MqttSubscriberService implements MqttCallback {
    private final MqttService mqttService;
    private final ButtonRepository buttonRepository;
    private final DialRepository dialRepository;
    private final UserRepository userRepository;
    private final TriggerDeviceRepository triggerDeviceRepository;
    private final TriggerRepository triggerRepository;

    @Autowired
    public MqttSubscriberService(MqttService mqttService, ButtonRepository buttonRepository,
                                 DialRepository dialRepository, UserRepository userRepository,
                                 TriggerDeviceRepository triggerDeviceRepository, TriggerRepository triggerRepository) {
        this.mqttService = mqttService;
        this.buttonRepository = buttonRepository;
        this.dialRepository = dialRepository;
        this.userRepository = userRepository;
        this.triggerDeviceRepository = triggerDeviceRepository;
        this.triggerRepository = triggerRepository;
    }

    public void subscribeToRegistrationTopic() {
        String topic = "hub/connect";
        /*topic에 대해여 QoS 1로 연결*/
        try {
            MqttClient client = mqttService.getClient();
            if (client.isConnected()) {
                /*토픽에 메시지가 publish 될 때마다 수신*/
                client.subscribe(topic, 1,(t, message) -> {
                    String payload = new String(message.getPayload());
                    System.out.println("기기 등록 요청 수신: " + payload);

                    //JSON 파싱
                    ObjectMapper objectMapper = new ObjectMapper();
                    JsonNode jsonNode = objectMapper.readTree(payload);
                    String type = jsonNode.get("type").asText();
                    String clientId = jsonNode.get("clientId").asText();
                    //DB에 저장
                    Long deviceId = saveDeviceToDB(type, clientId);
                    System.out.println(deviceId);
                    /*이미 DB에 있는 경우, 해당 기기가 속한 트리거 목록을 반환*/
                    if (deviceId != 0) {
                        /*device가 속한 트리거 id 목록*/
                        List<Long> triggerDeviceIds = triggerRepository.findTriggerDeviceIdsByDeviceTypeAndDeviceId(type, deviceId);
                        /*위 id 목록으로 트리거 client_id 목록 찾음*/
                        List<String> triggerClientIds = triggerDeviceRepository.findClientIdsByIds(triggerDeviceIds);
                        /*client_type 목록 구성*/
                        List<String> clientTypes = triggerDeviceRepository.findTriggerTypesByIds(triggerDeviceIds);
                        /*트리거 목록 JSON 구성*/
                        Map<String, List<String>> payloadMap = new HashMap<>();
                        payloadMap.put("clientType", clientTypes);
                        payloadMap.put("clientId", triggerClientIds);

                        String responseTopic = "server/triggers/" + type + "/" + clientId;
                        String responsePayload = objectMapper.writeValueAsString(payloadMap);
                        MqttMessage responseMessage = new MqttMessage(responsePayload.getBytes(StandardCharsets.UTF_8));
                        responseMessage.setQos(1);

                        client.publish(responseTopic, responseMessage);
                        /*요청하는 기기가 다이얼일 땨, stepUnit, currentStep 발행*/
                        if (type.equals("dial_actuator")) {
                            Dial dial = dialRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                            Map<String, Integer> secPayloadMap = new HashMap<>();
                            secPayloadMap.put("stepUnit", dial.getStepUnit());
                            secPayloadMap.put("currentStep", dial.getStep());
                            String secResponseTopic = "server/step/" + type + "/" + clientId;
                            String secResponsePayload = objectMapper.writeValueAsString(secPayloadMap);
                            MqttMessage secResponseMessage = new MqttMessage(secResponsePayload.getBytes(StandardCharsets.UTF_8));
                            responseMessage.setQos(1);

                            client.publish(secResponseTopic, secResponseMessage);
                        }
                    }
                });
            } else {
                System.err.println("MQTT 브로커에 연결되지 않음. 구독 실패");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    //db에 기기를 저장하고 db내 ID를 추출하여 반환
    private Long saveDeviceToDB(String type, String clientId) {
        User user = userRepository.findById(1L).orElseThrow(() -> new RuntimeException("User not found"));
        switch (type.toLowerCase()) {
            case "button_clicker" -> {
                Optional<Button> existing = buttonRepository.findByClientId(clientId);
                if (existing.isPresent()) {
                    System.out.println("이미 등록된 기기입니다.");
                    /*트리거 목록을 찾기 위한 device_id 반환*/
                    return existing.get().getId();
                }
                Button button = new Button();
                button.setName("button clicker");
                button.setUser(user);
                button.setClientId(clientId);
                buttonRepository.save(button);
                return 0L;
            }
            case "dial_actuator" -> {
                Optional<Dial> existing = dialRepository.findByClientId(clientId);
                if (existing.isPresent()) {
                    System.out.println("이미 등록된 기기입니다.");
                    /*트리거 목록을 찾기 위한 device_id 반환*/
                    return existing.get().getId();
                }
                Dial dial = new Dial();
                dial.setName("dial actuator");
                dial.setStep(0);
                dial.setUser(user);
                dial.setClientId(clientId);
                dialRepository.save(dial);
                return 0L;
            }
            case "door_sensor" -> {
                if (triggerDeviceRepository.existsByClientId(clientId)) {
                    System.out.println("이미 등록된 기기입니다.");
                    /*door_sensor은 트리거이므로 device_id 반환 X*/
                    return 0L;
                }
                TriggerDevice door = new TriggerDevice();
                door.setName("door sensor");
                door.setTriggerType("door_sensor");
                door.setUser(user);
                door.setClientId(clientId);
                triggerDeviceRepository.save(door);
                return 0L;
            }
            case "remote" -> {
                if (triggerDeviceRepository.existsByClientId(clientId)) {
                    System.out.println("이미 등록된 기기입니다.");
                    /*remote은 트리거이므로 device_id 반환 X*/
                    return 0L;
                }
                TriggerDevice remote = new TriggerDevice();
                remote.setName("remote");
                remote.setTriggerType("remote");
                remote.setUser(user);
                remote.setClientId(clientId);
                triggerDeviceRepository.save(remote);
                return 0L;
            }
            default -> throw new IllegalArgumentException("틀린 디바이스 타입");
        }
    }

    @Override
    public void connectionLost(Throwable throwable) {

    }

    @Override
    public void messageArrived(String s, MqttMessage mqttMessage) throws Exception {

    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {

    }
}
