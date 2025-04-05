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

//Mqtt 콜백 인터페이스
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

    public String subscribeToRegistrationTopic() {
        String topic = "hub/connect";

        try {
            mqttClient.subscribe(topic, (t, message) -> {
                String payload = new String(message.getPayload());
                System.out.println("기기 등록 요청 수신: " + payload);

                //JSON 파싱
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(payload);
                String name = jsonNode.get("name").asText();
                String type = jsonNode.get("type").asText();
                String serial = jsonNode.get("serial").asText();
                //DB에 저장
                Long deviceId = saveDeviceToDB(name, type);
                //등록 응답을 회신
                sendDeviceApprovalResponse(deviceId, type, serial);

                mqttClient.unsubscribe(topic);
            });
            return "기기 등록 요청 대기 중...";
        } catch (Exception e) {
            e.printStackTrace();
            return "기기 등록 실패";
        }
    }
    //db에 기기를 저장하고 db내 ID를 추출하여 반환
    private Long saveDeviceToDB(String name, String type) {
        User user = userRepository.findById(1L).orElseThrow(() -> new RuntimeException("User not found"));
        if ("button".equalsIgnoreCase(type)) {
            Button button = new Button();
            button.setName(name);
            button.setState(false);    //state는 필요한지 잘 모르겠음
            button.setUser(user);
            buttonRepository.save(button);
            return button.getId();
        } else if ("dial".equalsIgnoreCase(type)) {
            Dial dial = new Dial();
            dial.setName(name);
            dial.setState(false);  //state는 필요한지 잘 모르겠음
            dial.setStep(0);
            dial.setUser(user);
            dialRepository.save(dial);
            return dial.getId();
        } else if ("door".equalsIgnoreCase(type)) {
            Door door = new Door();
            door.setName(name);
            door.setState(false);
            door.setUser(user);
            doorRepository.save(door);
            return door.getId();
        } else {
            throw new IllegalArgumentException("Invalid device type: " + type);
        }
    }
    /*기기 등록 승인 응답을 회신
    * 그러기 위해 기기는 등록을 요청할 때 serial을 보냄
    * 서버에게 승인 응답을 받을 토픽을 구독하고 있어야 함
    * 서버는 payload로 deviceId를 보내고 기기는 해당 deviceId로 토픽을 새로 구독*/
    private void sendDeviceApprovalResponse(Long deviceId, String type, String serial) {
        try {
            String responseTopic = "hub/connect/response/" + serial;
            String responseMessage = "{ \"status\": \"approved\", \"deviceId\": " + deviceId
                    + ", \"type\": \"" + type + "\" }";

            mqttClient.publish(responseTopic, new MqttMessage(responseMessage.getBytes()));
            System.out.println("기기 등록 승인 응답 발행: " + responseMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


   /** //애플리케이션이 실행되면 자동으로 실행되어 {topicFilter}를 구독
    @PostConstruct
    public void subscribeToTopic() {
        try {
            mqttClient.setCallback(this);
            mqttClient.subscribe("iot/sensor");
            System.out.println("Subscribed to topic: iot/sensor");
        } catch (MqttException e) {
            e.printStackTrace();
        }
    } **/

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
