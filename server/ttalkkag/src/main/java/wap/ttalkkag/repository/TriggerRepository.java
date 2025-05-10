package wap.ttalkkag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wap.ttalkkag.domain.Trigger;
import wap.ttalkkag.domain.TriggerId;

import java.util.List;

@Repository
public interface TriggerRepository extends JpaRepository<Trigger, TriggerId> {
    List<Trigger> findByIdDoorId(Long doorId);
}
