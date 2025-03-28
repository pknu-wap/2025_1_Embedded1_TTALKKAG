package wap.ttalkkag.config;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//MQTT 설정 클래스
//TODO: 추후에 브로커 주소, 식별자 변경
@Configuration
public class MqttConfig {
    //브로커 주소
    private static final String BROKER_URL = "tcp://localhost:1883";
    //클라이언트 식별자
    private static final String CLIENT_ID = "springboot-client";

    @Bean
    public MqttClient mqttClient() throws MqttException {
        MqttClient client = new MqttClient(BROKER_URL, CLIENT_ID);
        MqttConnectOptions options = new MqttConnectOptions();
        //true -> 세션 새로 시작, false -> 브로커가 클라이언트의 구독 정보를 기억
        options.setCleanSession(true);
        client.connect(options); //브로커에 연결
        return client;
    }
}
