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

    private String name;

    @ManyToOne
    @MapsId("triggerDeviceId")
    @JoinColumn(name = "trigger_device_id", insertable = false, updatable = false)
    private TriggerDevice triggerDevice;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false, insertable = false, updatable = false)
    private Button button;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false, insertable = false, updatable = false)
    private Dial dial;
}
