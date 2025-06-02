package wap.ttalkkag.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
public class TriggerId implements Serializable {
    @Column(name = "trigger_device_id")
    private Long triggerDeviceId;

    @Column(name = "device_id")
    private Long deviceId;

    @Column(name = "device_type")
    private String deviceType;

    public TriggerId() {}

    public TriggerId(Long triggerDeviceId, Long deviceId, String deviceType) {
        this.triggerDeviceId = triggerDeviceId;
        this.deviceId = deviceId;
        this.deviceType = deviceType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TriggerId that = (TriggerId) o;
        return Objects.equals(triggerDeviceId, that.triggerDeviceId) &&
                Objects.equals(deviceId, that.deviceId) &&
                Objects.equals(deviceType, that.deviceType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(triggerDeviceId, deviceId, deviceType);
    }
}