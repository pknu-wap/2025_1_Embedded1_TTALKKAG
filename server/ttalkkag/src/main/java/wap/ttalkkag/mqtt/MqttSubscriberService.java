package wap.ttalkkag.mqtt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.stereotype.Service;
import wap.ttalkkag.domain.Button;
import wap.ttalkkag.domain.Dial;
import wap.ttalkkag.domain.Door;
import wap.ttalkkag.domain.User;
import wap.ttalkkag.repository.ButtonRepository;
import wap.ttalkkag.repository.DialRepository;
import wap.ttalkkag.repository.DoorRepository;
import wap.ttalkkag.repository.UserRepository;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/*Mqtt 콜백 인터페이스*/
@Service
public class MqttSubscriberService implements MqttCallback {
    private final MqttClient mqttClient;
    private final ButtonRepository buttonRepository;
    private final DialRepository dialRepository;
    private final UserRepository userRepository;
    private final BlockingQueue<String> messageQueue = new LinkedBlockingQueue<>();
    private final DoorRepository doorRepository;

    public MqttSubscriberService(MqttClient mqttClient, ButtonRepository buttonRepository,
                                 DialRepository dialRepository, UserRepository userRepository, DoorRepository doorRepository) {
        this.mqttClient = mqttClient;
        this.buttonRepository = buttonRepository;
        this.dialRepository = dialRepository;
        this.userRepository = userRepository;
        this.doorRepository = doorRepository;
    }
    @PostConstruct
    public void subscribeToRegistrationTopic() {
        String topic = "hub/connect";
        /*topic에 대해여 QoS 1로 연결*/
        try {
            mqttClient.subscribe(topic, 1,(t, message) -> {
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

                /*기기 등록을 1회만 한다면 주석 제거
                mqttClient.unsubscribe(topic);*/
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    //db에 기기를 저장하고 db내 ID를 추출하여 반환
    private void saveDeviceToDB(String name, String type, String clientId) {
        User user = userRepository.findById(1L).orElseThrow(() -> new RuntimeException("User not found"));
        switch (type.toLowerCase()) {
            case "button" -> {
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
            case "dial" -> {
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
            case "door" -> {
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

   /* //애플리케이션이 실행되면 자동으로 실행되어 {topicFilter}를 구독
    @PostConstruct
    public void subscribeToTopic() {
        try {
            mqttClient.setCallback(this);
            mqttClient.subscribe("iot/sensor");
            System.out.println("Subscribed to topic: iot/sensor");
        } catch (MqttException e) {
            e.printStackTrace();
        }
    } */

    //Mqtt 연결이 끊어졌을 시 로그 출력
    //TODO: 자동 재연결 로직을 추가
    @Override
    public void connectionLost(Throwable cause) {
        System.out.println("Connection lost: " + cause.getMessage());
    }

    //Mqtt 메시지를 받을 때 호출되어 메시지를 문자열로 변환
    //메시지 큐에 수신 받은 메시지 삽입
    @Override
    public void messageArrived(String topic, MqttMessage message) throws Exception {
        String receivedMessage = new String(message.getPayload());
        System.out.println("Received message: " + receivedMessage);
        messageQueue.offer(receivedMessage);
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {}

    //메시지 큐에서 마지막 메시지 poll
    public String getLastMessage() {
        return messageQueue.poll();
    }
}
