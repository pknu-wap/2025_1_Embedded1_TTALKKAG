package wap.ttalkkag.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "triggers")
@AllArgsConstructor
@NoArgsConstructor
public class Trigger {

    @EmbeddedId
    private TriggerId id;

    private String name;

    @ManyToOne
    @MapsId("doorId")
    @JoinColumn(name = "door_id", insertable = false, updatable = false)
    private Door door;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false, insertable = false, updatable = false)
    private Button button;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false, insertable = false, updatable = false)
    private Dial dial;
}
