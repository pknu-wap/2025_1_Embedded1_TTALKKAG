package wap.ttalkkag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wap.ttalkkag.domain.Trigger;

@Repository
public interface TriggerRepository extends JpaRepository<Trigger, Long> {
}
