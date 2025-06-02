package wap.ttalkkag.trigger;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wap.ttalkkag.domain.TriggerDevice;
import wap.ttalkkag.domain.Trigger;

import java.util.List;

@RestController
@RequestMapping("/trigger")
@RequiredArgsConstructor
public class TriggerController {
    private final TriggerService triggerService;

    /*user의 trigger_device 목록*/
    @GetMapping("/list")
    public ResponseEntity<List<TriggerDevice>> getTriggerList() {
        Long userId = 1L;
        List<TriggerDevice> doors = triggerService.getTriggers(userId);
        return ResponseEntity.ok(doors);
    }

    /*트리거 동작 시, 함께 동작할 디바이스 목록
    * 트리거 목록 페이지에서
    * 우선 등록된 모든 디바이스 목록을 불러온 후
    * 해당 api로 트리거에 속한 디바이스들의 타입과 id를 받아서
    * 위 모든 디바이스 목록 중 표시*/
    @GetMapping("/{trigger_device_id}/active-devices")
    public ResponseEntity<List<Trigger>> getActiveDevices(@PathVariable("trigger_device_id") Long triggerDeviceId) {
        List<Trigger> activeDevices = triggerService.getActiveDevices(triggerDeviceId);
        return ResponseEntity.ok(activeDevices);
    }
    /*트리거에 기기 추가(활성화) */
    @PostMapping("/activate")
    public ResponseEntity<Void> activateDevice(@RequestBody ActivateDeviceDTO request) {
        triggerService.activateDevice(request);
        return ResponseEntity.ok().build();
    }
    /*트리거에서 기기 제외(비활성화)*/
    @DeleteMapping("/deactivate")
    public ResponseEntity<Void> deactivateDevice(@RequestBody ActivateDeviceDTO request) {
        triggerService.deactivateDevice(request);
        return ResponseEntity.ok().build();
    }
}
