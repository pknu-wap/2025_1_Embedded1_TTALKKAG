package wap.ttalkkag.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import wap.ttalkkag.domain.enums.DeviceType;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
public class TriggerId implements Serializable {
    @Column(name = "door_id")
    private Long doorId;

    @Column(name = "device_id")
    private Long deviceId;

    @Column(name = "device_type")
    @Enumerated(EnumType.STRING)
    private DeviceType deviceType;

    public TriggerId() {}

    public TriggerId(Long doorId, Long deviceId, DeviceType deviceType) {
        this.doorId = doorId;
        this.deviceId = deviceId;
        this.deviceType = deviceType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TriggerId that = (TriggerId) o;
        return Objects.equals(doorId, that.doorId) &&
                Objects.equals(deviceId, that.deviceId) &&
                Objects.equals(deviceType, that.deviceType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(doorId, deviceId, deviceType);
    }
}
