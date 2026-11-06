package tz.mediflow.repo;
import tz.mediflow.model.Invoice; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface InvoiceRepo extends JpaRepository<Invoice,Long>{List<Invoice> findTop100ByOrderByCreatedAtDesc();}
