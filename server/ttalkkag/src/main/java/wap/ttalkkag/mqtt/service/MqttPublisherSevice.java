package wap.ttalkkag.mqtt.service;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Service;

@Service
public class MqttPublisherSevice {
    private final MqttClient mqttClient;

    public MqttPublisherSevice(MqttClient mqttClient) {
        this.mqttClient = mqttClient;
    }

    public void publishMessage(String topic, String message) {
        try {
            MqttMessage mqttMessage = new MqttMessage(message.getBytes());
            mqttMessage.setQos(1);
            mqttClient.publish(topic, mqttMessage);
            System.out.println("Published message: " + message);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
}
