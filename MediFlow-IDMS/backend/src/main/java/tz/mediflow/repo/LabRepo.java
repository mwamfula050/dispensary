package tz.mediflow.repo;
import tz.mediflow.model.LabOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface LabRepo extends JpaRepository<LabOrder,Long>{
 List<LabOrder> findTop100ByOrderByRequestedAtDesc();
 boolean existsByVisit_IdAndStatusNot(Long visitId,String status);
}
