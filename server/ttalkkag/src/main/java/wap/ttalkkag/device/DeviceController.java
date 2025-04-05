package wap.ttalkkag.device;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wap.ttalkkag.domain.User;
import wap.ttalkkag.repository.UserRepository;

@RestController
@RequestMapping("/device")
@RequiredArgsConstructor
public class DeviceController {
    private final DeviceService deviceService;

    /*등록된 디바이스 목록 불러오기
    로그인 기능 도입 후 확장 위해 userId에 연결된 기기 불러옴*/
    @GetMapping("/{userId}/list")
    public ResponseEntity<User> getDeviceList(@PathVariable("userId") Long userId) {
        User user = deviceService.getRegisteredDevices(userId);
        return ResponseEntity.ok(user);
    }
    /*디바이스의 이름 변경하기*/
    @PatchMapping("/{userId}/change-name")
    public ResponseEntity<Void> changeDeviceName(@PathVariable("userId") Long userId,
                                   @RequestBody ChangeDeviceSettingDTO request) {
        deviceService.updateDeviceName(userId, request);
        return ResponseEntity.ok().build();
    }
    /*디바이스 삭제하기*/
    @DeleteMapping("/{userId}/delete")
    public ResponseEntity<Void> deleteDevice(@PathVariable("userId") Long userId,
                                             @RequestBody DeleteDeviceDTO request) {
        deviceService.deleteDevice(userId, request);
        return ResponseEntity.ok().build();
    }
}
