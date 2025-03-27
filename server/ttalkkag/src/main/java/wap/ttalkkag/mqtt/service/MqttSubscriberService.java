package wap.ttalkkag.mqtt.service;

import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.stereotype.Service;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@Service
public class MqttSubscriberService implements MqttCallback {
    private final MqttClient mqttClient;
    private final BlockingQueue<String> messageQueue = new LinkedBlockingQueue<>();

    public MqttSubscriberService(MqttClient mqttClient) {
        this.mqttClient = mqttClient;
    }

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

    @Override
    public void connectionLost(Throwable cause) {
        System.out.println("Connection lost: " + cause.getMessage());
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) throws Exception {
        String receivedMessage = new String(message.getPayload());
        System.out.println("Received message: " + receivedMessage);
        messageQueue.offer(receivedMessage);
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {}

    public String getLastMessage() {
        return messageQueue.poll();
    }
}
