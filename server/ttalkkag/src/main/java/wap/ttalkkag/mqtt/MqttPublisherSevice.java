package wap.ttalkkag.mqtt;

import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MqttPublisherSevice {
    private final MqttClient mqttClient;

    //지정 topic에 message를 전송
    public void publishMessage(String topic, String message) {
        try {
            MqttMessage mqttMessage = new MqttMessage(message.getBytes());
            //QoS-1: 최소 한번 전송되는 것을 보장
            mqttMessage.setQos(1);
            mqttClient.publish(topic, mqttMessage);
            System.out.println("Published message: " + message);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
}
