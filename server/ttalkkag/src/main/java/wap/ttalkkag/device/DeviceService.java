package wap.ttalkkag.device;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wap.ttalkkag.domain.Button;
import wap.ttalkkag.domain.Dial;
import wap.ttalkkag.domain.Door;
import wap.ttalkkag.domain.User;
import wap.ttalkkag.repository.ButtonRepository;
import wap.ttalkkag.repository.DialRepository;
import wap.ttalkkag.repository.DoorRepository;
import wap.ttalkkag.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final UserRepository userRepository;
    private final ButtonRepository buttonRepository;
    private final DialRepository dialRepository;
    private final DoorRepository doorRepository;

    /*해당 userId에 연관된 디바이스 목록을 가져옴*/
    public User getRegisteredDevices(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    /*device의 이름을 변경
    TODO: 현재 user가 설정하고자 하는 device의 변경 권한을 가지고 있는지 확인하는 코드를 리팩토링
          중복된 코드도 많음.*/
    public void updateDeviceName(Long userId, ChangeDeviceSettingDTO request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Long deviceId = request.getDeviceId();
        String newName = request.getNewName();
        switch (request.getType()) {
            case "button" -> {
                Button button = buttonRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                if (!button.getUser().equals(user)) throw new RuntimeException("No change permission");

                button.setName(newName);
                buttonRepository.save(button);
            }
            case "dial" -> {
                Dial dial = dialRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                if (!dial.getUser().equals(user)) throw new RuntimeException("No change permission");
                dial.setName(newName);
                dialRepository.save(dial);
            }
            case "door" -> {
                Door door = doorRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                if (!door.getUser().equals(user)) throw new RuntimeException("No change permission");
                door.setName(newName);
                doorRepository.save(door);
            }
            default -> throw new IllegalArgumentException("Wrong device type");
        }
    }
    /*기기 삭제, 삭제 권한이 있는지 확인 후 삭제*/
    public void deleteDevice(Long userId, DeleteDeviceDTO request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Long deviceId = request.getDeviceId();
        switch(request.getType()) {
            case "button" -> {
                Button button = buttonRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                if (!button.getUser().equals(user)) throw new RuntimeException("No change permission");
                buttonRepository.delete(button);
            }
            case "dial" -> {
                Dial dial = dialRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                if (!dial.getUser().equals(user)) throw new RuntimeException("No change permission");
                dialRepository.delete(dial);
            }
            case "door" -> {
                Door door = doorRepository.findById(deviceId).orElseThrow(() -> new RuntimeException("Device not found"));
                if (!door.getUser().equals(user)) throw new RuntimeException("No change permission");
                doorRepository.delete(door);
            }
            default -> throw new IllegalArgumentException("Wrong device type");
        }
    }
}
