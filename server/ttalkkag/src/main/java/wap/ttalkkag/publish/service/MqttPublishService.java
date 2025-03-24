package wap.ttalkkag.publish.service;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Service;

@Service
public class MqttPublishService {
    private MqttClient mqttClient;

    public MqttPublishService(MqttClient mqttClient) {
        this.mqttClient = mqttClient;
    }

    public void sendMessage(String topic, String message) {
        try {
            mqttClient.publish(topic, new MqttMessage(message.getBytes()));
        } catch (MqttException e) {
            throw new RuntimeException(e);
        }
    }
}
