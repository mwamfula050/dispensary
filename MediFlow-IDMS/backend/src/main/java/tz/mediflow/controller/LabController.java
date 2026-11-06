package tz.mediflow.controller;
import tz.mediflow.model.*;import tz.mediflow.repo.*;import jakarta.validation.Valid;import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.web.bind.annotation.*;import java.util.*;
import org.springframework.web.server.ResponseStatusException;
@RestController @RequestMapping("/api/lab")
public class LabController {
 private final LabRepo labs;private final VisitRepo visits;
 public LabController(LabRepo l,VisitRepo v){labs=l;visits=v;}
 public record Request(@NotNull Long visitId,@NotBlank @Size(max=120) String testName){}
 public record Result(@NotBlank @Size(max=1000) String result,@Size(max=1000) String interpretation,@Size(max=80) String specimenCode){}
 @PostMapping("/orders") @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
 public LabOrder order(@Valid @RequestBody Request x){
  Visit v=visits.findById(x.visitId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Visit not found"));
  v.setStatus("AWAITING_LAB");v.setDepartment("LABORATORY");visits.save(v);
  return labs.save(new LabOrder(v,x.testName()));
 }
 @GetMapping("/orders") @PreAuthorize("hasAnyRole('ADMIN','MANAGER','DOCTOR','LAB_TECHNICIAN','RECORDS_OFFICER')")
 public List<LabOrder> list(){return labs.findTop100ByOrderByRequestedAtDesc();}
 @PatchMapping("/orders/{id}/result") @PreAuthorize("hasAnyRole('ADMIN','LAB_TECHNICIAN')")
 public LabOrder result(@PathVariable Long id,@Valid @RequestBody Result x){
  LabOrder l=labs.findById(id).orElseThrow();if(l.getStatus().equals("VERIFIED"))throw new ResponseStatusException(HttpStatus.CONFLICT,"Verified result cannot be edited");
  l.setResult(x.result());l.setInterpretation(x.interpretation());l.setSpecimenCode(x.specimenCode());l.setStatus("PENDING_VERIFICATION");return labs.save(l);
 }
 @PostMapping("/orders/{id}/verify") @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
 public LabOrder verify(@PathVariable Long id,org.springframework.security.core.Authentication auth){
  LabOrder l=labs.findById(id).orElseThrow();if(l.getResult()==null||l.getResult().isBlank())throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Enter a result before verification");
  l.verify(auth.getName());labs.save(l);
  boolean remaining=labs.existsByVisit_IdAndStatusNot(l.getVisit().getId(),"VERIFIED");
  if(!remaining){Visit v=l.getVisit();v.setStatus("RESULTS_READY_FOR_DOCTOR");v.setDepartment("DOCTOR_REVIEW");visits.save(v);}
  return l;
 }
}
