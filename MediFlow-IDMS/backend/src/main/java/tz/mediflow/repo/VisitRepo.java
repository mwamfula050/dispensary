package tz.mediflow.repo;
import tz.mediflow.model.Visit; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface VisitRepo extends JpaRepository<Visit,Long>{List<Visit> findTop100ByOrderByRegisteredAtDesc();}
