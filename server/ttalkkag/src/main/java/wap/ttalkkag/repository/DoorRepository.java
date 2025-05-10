package wap.ttalkkag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wap.ttalkkag.domain.Door;
import wap.ttalkkag.domain.User;

import java.util.List;

@Repository
public interface DoorRepository extends JpaRepository<Door, Long> {
    boolean existsByClientId(String clientId);

    Long user(User user);

    /*user_id에 속한 door_sensor 목록*/
    List<Door> findByUserId(Long userId);
}
