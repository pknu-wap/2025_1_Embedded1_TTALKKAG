package wap.ttalkkag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wap.ttalkkag.domain.Dial;

@Repository
public interface DialRepository extends JpaRepository<Dial, Long> {
}
