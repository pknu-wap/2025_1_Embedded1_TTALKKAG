package wap.ttalkkag.trigger;

import lombok.Getter;
import lombok.Setter;

/*트리거에 기기 추가, 제외(활성화, 비활성화)를 위한 DTO*/
@Getter
@Setter
public class ActivateDeviceDTO {
    private Long triggerDeviceId;
    private Long deviceId;
    private String deviceType;
}