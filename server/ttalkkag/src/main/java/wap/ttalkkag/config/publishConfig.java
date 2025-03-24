package wap.ttalkkag.config;

import lombok.Value;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class publishConfig {

//    @Value("${mqtt.broker.url}")
    private String brokerUrl = "tcp://localhost:1883";

//    @Value("${mqtt.publisher.client.id}")
    private String clientId = "publisher";

    @Bean
    public MqttConnectOptions mqttConnectOptions() {
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{brokerUrl});
        options.setCleanSession(true);
        return options;
    }

    @Bean
    public MqttClient mqttClient() {
        try {
            MqttClient mqttClient = new MqttClient(brokerUrl, clientId,
                    new MemoryPersistence());
            mqttClient.connect(mqttConnectOptions());
            return mqttClient;
        } catch (MqttException e) {
            throw new RuntimeException(e);
        }
    }
}
