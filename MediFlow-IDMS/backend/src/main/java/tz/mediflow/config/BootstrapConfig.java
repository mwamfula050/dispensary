package tz.mediflow.config;
import tz.mediflow.model.*; import tz.mediflow.repo.UserRepo;
import org.springframework.beans.factory.annotation.Value; import org.springframework.boot.CommandLineRunner; import org.springframework.context.annotation.Bean; import org.springframework.context.annotation.Configuration; import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration
public class BootstrapConfig {
 @Bean CommandLineRunner bootstrap(UserRepo users,PasswordEncoder encoder,
  @Value("${app.bootstrap.enabled:false}") boolean enabled,@Value("${app.bootstrap.username:admin}") String username,
  @Value("${app.bootstrap.password:}") String password,@Value("${app.bootstrap.full-name:Administrator}") String name){
  return args->{if(enabled&&!users.existsByUsername(username)){
   if(password==null||password.length()<14)throw new IllegalStateException("Bootstrap password must be at least 14 characters");
   users.save(new AppUser(username,encoder.encode(password),name,Role.ADMIN));
  }};
 }
}
