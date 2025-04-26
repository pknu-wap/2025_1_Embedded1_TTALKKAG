package wap.ttalkkag.mqtt;

import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MqttPublisherSevice {
    private final MqttService mqttService;

    //지정 topic에 message를 전송
    public void publish(String topic, String payload) {
        try {
            MqttClient client = mqttService.getClient();
            if (!client.isConnected()) {
                MqttConnectOptions options = new MqttConnectOptions();
                options.setCleanSession(true);
                client.connect(options);
            }
            MqttMessage message = new MqttMessage(payload.getBytes());
            message.setQos(1);
            client.publish(topic, message);
        } catch (MqttException e){
            System.err.println("MQTT 연결/발행 실패: " + e.getMessage());
        }
    }
}
