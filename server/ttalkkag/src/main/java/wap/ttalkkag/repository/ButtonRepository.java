package wap.ttalkkag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wap.ttalkkag.domain.Button;

import java.util.Optional;

@Repository
public interface ButtonRepository extends JpaRepository<Button, Long> {
    boolean existsByClientId(String clientId);

    Optional<Button> findByClientId(String clientId);
}
