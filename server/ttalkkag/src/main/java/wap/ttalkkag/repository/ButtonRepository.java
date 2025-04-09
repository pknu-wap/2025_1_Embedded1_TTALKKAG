package wap.ttalkkag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wap.ttalkkag.domain.Button;

@Repository
public interface ButtonRepository extends JpaRepository<Button, Long> {
}
