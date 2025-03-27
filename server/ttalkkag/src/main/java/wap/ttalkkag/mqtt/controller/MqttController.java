package wap.ttalkkag.mqtt.controller;

import org.springframework.web.bind.annotation.*;
import wap.ttalkkag.mqtt.dto.MqttPublishRequestDTO;
import wap.ttalkkag.mqtt.service.MqttPublisherSevice;
import wap.ttalkkag.mqtt.service.MqttSubscriberService;

@RestController
@RequestMapping("/mqtt")
public class MqttController {
    private final MqttPublisherSevice mqttPublisherSevice;
    private final MqttSubscriberService mqttSubscriberService;

    public MqttController(MqttPublisherSevice mqttPublisherSevice,
                          MqttSubscriberService mqttSubscriberService) {
        this.mqttPublisherSevice = mqttPublisherSevice;
        this.mqttSubscriberService = mqttSubscriberService;
    }

    @PostMapping("/publish")
    public String publishMessage(@RequestBody MqttPublishRequestDTO request) {
        mqttPublisherSevice.publishMessage(request.getTopic(), request.getMessage());
        return "Message sent to topic: " + request.getTopic();
    }

    @GetMapping("/last-message")
    public String getLastReceivedMessage() {
        String lastMessage = mqttSubscriberService.getLastMessage();
        return lastMessage != null ? "Last received message: " + lastMessage : "No messages received yet.";
    }
}
