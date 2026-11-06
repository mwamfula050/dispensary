package tz.mediflow.repo;
import tz.mediflow.model.AppUser; import org.springframework.data.jpa.repository.JpaRepository; import java.util.Optional;
public interface UserRepo extends JpaRepository<AppUser,Long>{Optional<AppUser> findByUsername(String username); boolean existsByUsername(String username);}
