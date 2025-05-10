package wap.ttalkkag.trigger;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wap.ttalkkag.domain.Door;
import wap.ttalkkag.domain.Trigger;

import java.util.List;

@RestController
@RequestMapping("/trigger")
@RequiredArgsConstructor
public class TriggerController {
    private final TriggerService triggerService;
    private final Long userId = 1L;

    @GetMapping("/list")
    public ResponseEntity<List<Door>> getTriggerList() {
        List<Door> doors = triggerService.getTriggers(userId);
        return ResponseEntity.ok(doors);
    }

    /*트리거 동작 시, 함께 동작할 디바이스 목록
    * 트리거 목록 페이지에서
    * 우선 등록된 모든 디바이스 목록을 불러온 후
    * 해당 api로 트리거에 속한 디바이스들의 타입과 id를 받아서
    * 위 모든 디바이스 목록 중 표시*/
    @GetMapping("/{trigger_id}/active_devices")
    public ResponseEntity<List<Trigger>> getActiveDevices(@PathVariable("trigger_id") Long triggerId) {
        List<Trigger> activeDevices = triggerService.getActiveDevices(triggerId);
        return ResponseEntity.ok(activeDevices);
    }
}
