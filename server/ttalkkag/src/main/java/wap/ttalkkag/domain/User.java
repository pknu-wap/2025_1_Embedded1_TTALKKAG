package wap.ttalkkag.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clientId;
    private String brokerUrl;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Button> buttons;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Dial> dials;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Dial> doors;
}
