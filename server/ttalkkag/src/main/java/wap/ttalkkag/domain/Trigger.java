package wap.ttalkkag.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "triggers")
@Getter
@Setter
@Access(AccessType.FIELD)
@AllArgsConstructor
@NoArgsConstructor
public class Trigger {

    @EmbeddedId
    private TriggerId id;
}
