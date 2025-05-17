package wap.ttalkkag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wap.ttalkkag.domain.Dial;

import java.util.Optional;

@Repository
public interface DialRepository extends JpaRepository<Dial, Long> {
    boolean existsByClientId(String clientId);

    Optional<Dial> findByClientId(String clientId);
}
