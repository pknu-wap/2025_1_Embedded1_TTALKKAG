package wap.ttalkkag.trigger;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wap.ttalkkag.domain.Door;
import wap.ttalkkag.domain.Trigger;
import wap.ttalkkag.domain.TriggerId;
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
    /*트리거에 기기 추가(활성화) */
    public void activateDevice(ActivateDeviceDTO request) {
        TriggerId triggerId = new TriggerId();
        triggerId.setDoorId(request.getDoorId());
        triggerId.setDeviceId(request.getDeviceId());
        triggerId.setDeviceType(request.getDeviceType());

        Trigger trigger = new Trigger();
        trigger.setId(triggerId);

        triggerRepository.save(trigger);
    }
    /*트리거에서 기기 제외(비활성화)*/
    public void deactivateDevice(ActivateDeviceDTO request) {
        TriggerId triggerId = new TriggerId();
        triggerId.setDoorId(request.getDoorId());
        triggerId.setDeviceId(request.getDeviceId());
        triggerId.setDeviceType(request.getDeviceType());

        if (triggerRepository.existsById(triggerId)) {
            triggerRepository.deleteById(triggerId);
        } else {
            throw new EntityNotFoundException("Trigger not found");
        }
    }
}
