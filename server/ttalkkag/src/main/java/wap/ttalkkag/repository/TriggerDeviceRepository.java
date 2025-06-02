package wap.ttalkkag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wap.ttalkkag.domain.TriggerDevice;
import wap.ttalkkag.domain.User;

import java.util.List;

@Repository
public interface TriggerDeviceRepository extends JpaRepository<TriggerDevice, Long> {
    boolean existsByClientId(String clientId);

    Long user(User user);

    /*user_id에 속한 trigger device 목록*/
    List<TriggerDevice> findByUserId(Long userId);

    @Query("SELECT d.clientId FROM TriggerDevice d WHERE d.id IN :triggerIds")
    List<String> findClientIdsByIds(@Param("triggerIds") List<Long> triggerIds);

    @Query("SELECT td.triggerType FROM TriggerDevice td WHERE td.id IN :ids")
    List<String> findTriggerTypesByIds(@Param("ids") List<Long> ids);
}
