package wap.ttalkkag.mqtt;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import wap.ttalkkag.domain.Button;
import wap.ttalkkag.repository.ButtonRepository;

@RestController
@RequestMapping("/mqtt")
public class MqttController {
    private final MqttPublisherSevice mqttPublisherSevice;
    private final MqttSubscriberService mqttSubscriberService;
    private final ButtonRepository buttonRepository;

    public MqttController(MqttPublisherSevice mqttPublisherSevice,
                          MqttSubscriberService mqttSubscriberService, ButtonRepository buttonRepository) {
        this.mqttPublisherSevice = mqttPublisherSevice;
        this.mqttSubscriberService = mqttSubscriberService;
        this.buttonRepository = buttonRepository;
    }
    /*버튼 클릭커 원격 조정*/
    @PostMapping("/{device_id}/press")
    public ResponseEntity<Void> pressButton(@PathVariable("device_id") Long device_id) {
        /*잘못된 버튼 id*/
        Button button = buttonRepository.findById(device_id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid device id"));
        /*토픽: server/{type}/{client_id}/action*/
        String topic = "server/button_clicker/" + button.getClientId() + "/action";
        mqttPublisherSevice.publish(topic, "");

        return ResponseEntity.ok().build();
    }

    /*새로운 기기 등록 버튼을 눌러서 등록한다면 주석 제거
    @PostMapping("/new-device")
    public String registerDevice() {
        return mqttSubscriberService.subscribeToRegistrationTopic();
    }*/

    /* //토픽, 메시지 지정 후 발행
    @PostMapping("/publish")
    public String publishMessage(@RequestBody MqttPublishRequestDTO request) {
        mqttPublisherSevice.publishMessage(request.getTopic(), request.getMessage());
        return "Message sent to topic: " + request.getTopic();
    }

    //구독 중인 토픽 내에 최신 메시지 return
    @GetMapping("/last-message")
    public String getLastReceivedMessage() {
        String lastMessage = mqttSubscriberService.getLastMessage();
        return lastMessage != null ? "Last received message: " + lastMessage : "No messages received yet.";
    } */
}
