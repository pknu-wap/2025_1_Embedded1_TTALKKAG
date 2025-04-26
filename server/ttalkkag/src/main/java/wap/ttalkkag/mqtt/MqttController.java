package wap.ttalkkag.mqtt;

import org.eclipse.paho.client.mqttv3.MqttClient;
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
    private final MqttService mqttService;
    private final ButtonRepository buttonRepository;

    public MqttController(MqttPublisherSevice mqttPublisherSevice,
                          MqttSubscriberService mqttSubscriberService,
                          MqttService mqttService,
                          ButtonRepository buttonRepository) {
        this.mqttPublisherSevice = mqttPublisherSevice;
        this.mqttSubscriberService = mqttSubscriberService;
        this.mqttService = mqttService;
        this.buttonRepository = buttonRepository;
    }
    /*어플 실행 시, 새로운 기기 등록 요청 토픽 지속적 구독*/
    /*TODO: 기기가 등록이 되면 자동으로 기기 목록 페이지에 새로운 기기 추가되도록
    *  (하려면 SSE나 프론트-백 간에 MQTT 통신 필요함)*/
    @PostMapping("/new-device")
    public ResponseEntity<String> registerDevice() {
       try {
           mqttService.connectToBroker();

           mqttSubscriberService.subscribeToRegistrationTopic();

           return ResponseEntity.ok().build();
       } catch (Exception e) {
           e.printStackTrace();
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
    }
    /*버튼 클릭커 원격 조정*/
    @PostMapping("/{device_id}/press")
    public ResponseEntity<Void> pressButton(@PathVariable("device_id") Long device_id) {
        /*잘못된 버튼 id*/
        Button button = buttonRepository.findById(device_id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid device id"));
        /*토픽: server/{type}/{client_id}/action*/
        String topic = "server/button_clicker/" + button.getClientId() + "/action";
        mqttPublisherSevice.publish(topic, " ");

        return ResponseEntity.ok().build();
    }
}
