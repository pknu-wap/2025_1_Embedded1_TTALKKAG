package wap.ttalkkag.publish.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import wap.ttalkkag.publish.dto.MqttRequestDto;
import wap.ttalkkag.publish.service.MqttPublishService;

@RestController
public class MqttPublishController {
    MqttPublishService mqttPublishService;

    public MqttPublishController(MqttPublishService mqttPublishService) {
        this.mqttPublishService = mqttPublishService;
    }

    @PostMapping("/mqtt/publish")
    public void SendTopicAndMessage(@RequestBody MqttRequestDto mqttRequestDto) {
        mqttPublishService.sendMessage(mqttRequestDto.getTopic(), mqttRequestDto.getMessage());
    }
}
