package tz.mediflow.repo;
import tz.mediflow.model.Patient; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface PatientRepo extends JpaRepository<Patient,Long>{List<Patient> findTop100ByFullNameContainingIgnoreCaseOrPatientNumberContainingIgnoreCase(String name,String number);}
