package wap.ttalkkag.mqtt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wap.ttalkkag.domain.Button;
import wap.ttalkkag.domain.Dial;
import wap.ttalkkag.domain.Door;
import wap.ttalkkag.domain.User;
import wap.ttalkkag.repository.ButtonRepository;
import wap.ttalkkag.repository.DialRepository;
import wap.ttalkkag.repository.DoorRepository;
import wap.ttalkkag.repository.UserRepository;


/*Mqtt 콜백 인터페이스*/
@Service
public class MqttSubscriberService implements MqttCallback {
    private final MqttService mqttService;
    private final ButtonRepository buttonRepository;
    private final DialRepository dialRepository;
    private final UserRepository userRepository;
    private final DoorRepository doorRepository;

    @Autowired
    public MqttSubscriberService(MqttService mqttService, ButtonRepository buttonRepository,
                                 DialRepository dialRepository, UserRepository userRepository, DoorRepository doorRepository) {
        this.mqttService = mqttService;
        this.buttonRepository = buttonRepository;
        this.dialRepository = dialRepository;
        this.userRepository = userRepository;
        this.doorRepository = doorRepository;
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
                    String name = jsonNode.get("name").asText();
                    String type = jsonNode.get("type").asText();
                    String clientId = jsonNode.get("clientId").asText();
                    //DB에 저장
                    saveDeviceToDB(name, type, clientId);
                });
            } else {
                System.err.println("MQTT 브로커에 연결되지 않음. 구독 실패");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    //db에 기기를 저장하고 db내 ID를 추출하여 반환
    private void saveDeviceToDB(String name, String type, String clientId) {
        User user = userRepository.findById(1L).orElseThrow(() -> new RuntimeException("User not found"));
        switch (type.toLowerCase()) {
            case "button_clicker" -> {
                if (buttonRepository.existsByClientId(clientId)) {
                    System.out.println("이미 등록된 기기입니다.");
                    return;
                }
                Button button = new Button();
                button.setName(name);
                button.setUser(user);
                button.setClientId(clientId);
                buttonRepository.save(button);
            }
            case "dial_actuator" -> {
                if (dialRepository.existsByClientId(clientId)) {
                    System.out.println("이미 등록된 기기입니다.");
                    return;
                }
                Dial dial = new Dial();
                dial.setName(name);
                dial.setStep(0);
                dial.setUser(user);
                dial.setClientId(clientId);
                dialRepository.save(dial);
            }
            case "door_sensor" -> {
                if (doorRepository.existsByClientId(clientId)) {
                    System.out.println("이미 등록된 기기입니다.");
                    return;
                }
                Door door = new Door();
                door.setName(name);
                door.setUser(user);
                door.setClientId(clientId);
                doorRepository.save(door);
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
