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

    @ManyToOne
    @MapsId("triggerDeviceId")
    @JoinColumn(name = "trigger_device_id",
            foreignKey = @ForeignKey(name = "fk_triggers_trigger_device",
            foreignKeyDefinition = "FOREIGN KEY (trigger_device_id) REFERENCES trigger_devices(id) ON DELETE CASCADE"))
    private TriggerDevice triggerDevice;
}
