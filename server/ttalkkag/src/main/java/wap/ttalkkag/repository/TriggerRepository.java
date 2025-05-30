package wap.ttalkkag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wap.ttalkkag.domain.Trigger;
import wap.ttalkkag.domain.TriggerId;

import java.util.List;

@Repository
public interface TriggerRepository extends JpaRepository<Trigger, TriggerId> {
    List<Trigger> findByIdTriggerDeviceId(Long TriggerId);

    @Query("SELECT t.id.triggerDeviceId FROM Trigger t WHERE t.id.deviceType = :deviceType AND t.id.deviceId = :deviceId")
    List<Long> findTriggerDeviceIdsByDeviceTypeAndDeviceId(@Param("deviceType") String deviceType,
                                                  @Param("deviceId") Long deviceId);

}
