package wap.ttalkkag.mqtt;

import org.springframework.web.bind.annotation.*;

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

    //TODO: return 형식 합의 후 변경 필요
    //토픽, 메시지 지정 후 발행
    @PostMapping("/publish")
    public String publishMessage(@RequestBody MqttPublishRequestDTO request) {
        mqttPublisherSevice.publishMessage(request.getTopic(), request.getMessage());
        return "Message sent to topic: " + request.getTopic();
    }

    //TODO: return 형식 합의 후 변경 필요
    //구독 중인 토픽 내에 최신 메시지 return
    @GetMapping("/last-message")
    public String getLastReceivedMessage() {
        String lastMessage = mqttSubscriberService.getLastMessage();
        return lastMessage != null ? "Last received message: " + lastMessage : "No messages received yet.";
    }
}
