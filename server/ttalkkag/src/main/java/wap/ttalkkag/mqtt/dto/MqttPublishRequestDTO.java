package wap.ttalkkag.mqtt.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MqttPublishRequestDTO {
    private String topic;
    private String message;
}
