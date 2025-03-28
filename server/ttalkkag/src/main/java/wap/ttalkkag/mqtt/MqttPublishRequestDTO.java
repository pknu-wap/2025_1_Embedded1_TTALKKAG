package wap.ttalkkag.mqtt;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MqttPublishRequestDTO {
    private String topic;
    private String message;
}
