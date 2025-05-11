package wap.ttalkkag.trigger;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wap.ttalkkag.domain.Door;
import wap.ttalkkag.domain.Trigger;
import wap.ttalkkag.repository.DoorRepository;
import wap.ttalkkag.repository.TriggerRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TriggerService {
    private final DoorRepository doorRepository;
    private final TriggerRepository triggerRepository;

    /*user의 door_sensor 목록*/
    public List<Door> getTriggers(Long userId) {
        return doorRepository.findByUserId(userId);
    }

    /*특정 트리거가 동작하면 함께 동작할 디바이스 목록*/
    public List<Trigger> getActiveDevices(Long triggerId) {
        return triggerRepository.findByIdDoorId(triggerId);
    }
}
