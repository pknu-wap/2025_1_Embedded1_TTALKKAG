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
    public void publish(String topic, String payload) {
        try {
            MqttMessage message = new MqttMessage(payload.getBytes());
            message.setQos(1);
            mqttClient.publish(topic, message);
        } catch (MqttException e){
            throw new RuntimeException("MQTT publish failed", e);
        }
    }
}
