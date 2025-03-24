package wap.ttalkkag.publish.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MqttRequestDto {
    private String topic;
    private String message;

    public String getTopic() {
        return topic;
    }
    public String getMessage() {
        return message;
    }
}
