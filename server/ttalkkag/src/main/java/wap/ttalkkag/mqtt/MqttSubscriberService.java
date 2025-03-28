package wap.ttalkkag.mqtt;

import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.stereotype.Service;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

//Mqtt 콜백 인터페이스
@Service
public class MqttSubscriberService implements MqttCallback {
    private final MqttClient mqttClient;
    private final BlockingQueue<String> messageQueue = new LinkedBlockingQueue<>();

    public MqttSubscriberService(MqttClient mqttClient) {
        this.mqttClient = mqttClient;
    }

    //애플리케이션이 실행되면 자동으로 실행되어 {topicFilter}를 구독
    @PostConstruct
    public void subscribeToTopic() {
        try {
            mqttClient.setCallback(this);
            mqttClient.subscribe("iot/sensor");
            System.out.println("Subscribed to topic: iot/sensor");
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

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
