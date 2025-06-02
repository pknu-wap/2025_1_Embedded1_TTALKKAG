package wap.ttalkkag.device;

import lombok.Getter;
import lombok.Setter;

/*기기 삭제를 위한 dto*/
@Getter
@Setter
public class DeleteDeviceDTO {
    private String type;
    private Long deviceId;
}
