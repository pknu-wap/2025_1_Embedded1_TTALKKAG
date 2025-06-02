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
            /*브로커와 연결 후 생성된 Mqtt Client 인스턴스 가져오기*/
            MqttClient client = mqttService.getClient();
            /*인스턴스 없으면 새로 연결 진행 후 생성*/
            if (client == null || !client.isConnected()) {
                mqttService.connectToBroker();
                client = mqttService.getClient();
            }
            MqttMessage message = new MqttMessage(payload.getBytes());
            message.setQos(1);
            client.publish(topic, message);
        } catch (MqttException e){
            System.err.println("MQTT 연결/발행 실패: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("기타 예외: " + e.getMessage());
        }
    }
}
