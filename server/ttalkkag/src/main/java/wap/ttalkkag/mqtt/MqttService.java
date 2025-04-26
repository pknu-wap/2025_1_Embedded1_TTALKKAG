package wap.ttalkkag.mqtt;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wap.ttalkkag.domain.User;
import wap.ttalkkag.repository.UserRepository;

@Service
public class MqttService {
    private final UserRepository userRepository;
    private MqttClient mqttClient;

    @Autowired
    public MqttService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /*MQTT 브로커와 연결 == MQTT client 생성*/
    public void connectToBroker() throws Exception {
        if (mqttClient != null && mqttClient.isConnected()) {
            return;
        }
        Long userId = 1L;
        User user = userRepository.findById(userId).orElseThrow(() -> new Exception("User not found"));

        String brokerUrl = user.getBrokerUrl();
        String clientId = user.getClientId();

        this.mqttClient = new MqttClient(brokerUrl, clientId, new MemoryPersistence());
        MqttConnectOptions options = new MqttConnectOptions();
        /*MemoryPersistence + setCleanSession으로 휘발성 세션 연결*/
        options.setCleanSession(true);

        try {
            mqttClient.connect(options);
            System.out.println("MQTT 연결 완료");
        } catch (MqttException e) {
            System.out.println("MQTT 연결 실패: " + e.getMessage());
            throw e;
        }
    }
    public MqttClient getClient() {
        return mqttClient;
    }
}
