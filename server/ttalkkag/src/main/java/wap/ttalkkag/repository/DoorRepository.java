package wap.ttalkkag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wap.ttalkkag.domain.Door;

@Repository
public interface DoorRepository extends JpaRepository<Door, Long> {
}
