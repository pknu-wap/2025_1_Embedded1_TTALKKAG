package wap.ttalkkag.device;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wap.ttalkkag.domain.User;

@RestController
@RequestMapping("/device")
@RequiredArgsConstructor
public class DeviceController {
    private final DeviceService deviceService;
    /*등록된 디바이스 목록 불러오기*/
    @GetMapping("/list")
    public ResponseEntity<User> getDeviceList() {
        Long userId = 1L;
        User user = deviceService.getRegisteredDevices(userId);
        return ResponseEntity.ok(user);
    }
    /*디바이스의 이름 변경하기*/
    @PatchMapping("/change-name")
    public ResponseEntity<Void> changeDeviceName(@RequestBody ChangeDeviceSettingDTO request) {
        deviceService.updateDeviceName(request);
        return ResponseEntity.ok().build();
    }
    /*디바이스 삭제하기*/
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteDevice(@RequestBody DeleteDeviceDTO request) {
        deviceService.deleteDevice(request);
        return ResponseEntity.ok().build();
    }
    /*기기 메모 변경*/
    @PatchMapping("/memo")
    public ResponseEntity<Void> patchDeviceMemo(@RequestBody PatchDeviceMemoDTO request) {
        deviceService.patchDeviceMemo(request);
        return ResponseEntity.ok().build();
    }
    /*다이얼 최대 step 설정*/
    @PatchMapping("/max-step")
    public ResponseEntity<Void> changeDialMaxStep(@RequestBody PatchDialMaxStepDTO request) {
        deviceService.changeDialMaxStep(request);

        return ResponseEntity.ok().build();
    }
}
