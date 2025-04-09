package wap.ttalkkag.device;

import lombok.Getter;
import lombok.Setter;

/*기기의 이름을 변경하기 위한 DTO*/
@Getter
@Setter
public class ChangeDeviceSettingDTO {
    private String type;
    private Long deviceId;
    private String newName;
}
