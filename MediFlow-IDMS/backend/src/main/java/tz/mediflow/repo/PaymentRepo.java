package tz.mediflow.repo;
import tz.mediflow.model.Payment; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface PaymentRepo extends JpaRepository<Payment,Long>{List<Payment> findTop100ByOrderByPaidAtDesc();}
