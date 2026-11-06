package tz.mediflow.controller;

import tz.mediflow.model.*;
import tz.mediflow.repo.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@RestController
@RequestMapping("/api/visits")
public class VisitController {
 private final VisitRepo visits; private final PatientRepo patients;
 public VisitController(VisitRepo v,PatientRepo p){visits=v;patients=p;}

 public record NewVisit(@NotNull Long patientId){}
 public record Triage(
  @Size(max=30) String bloodPressure,
  @DecimalMin("25.0") @DecimalMax("45.0") Double temperature,
  @DecimalMin("0.1") @DecimalMax("500.0") Double weight,
  @DecimalMin("20.0") @DecimalMax("250.0") Double height,
  @Min(20) @Max(250) Integer pulseRate,
  @Min(5) @Max(80) Integer respiratoryRate,
  @DecimalMin("0.0") @DecimalMax("100.0") Double oxygenSaturation,
  @Size(max=3000) String nurseNotes,
  @Size(max=30) String priority,
  @Size(max=1000) String notes
 ){}
 public record Consultation(
  @NotBlank @Size(max=3000) String symptoms,
  @Size(max=500) String symptomDuration,
  @Size(max=3000) String medicalHistory,
  @Size(max=3000) String examination,
  @Size(max=1000) String provisionalDiagnosis,
  @Size(max=3000) String consultationNotes,
  @Size(max=1000) String diagnosis,
  @Size(max=3000) String advice,
  @Size(max=3000) String medicineInstructions,
  boolean requiresLab
 ){}

 @PostMapping
 @Transactional
 @PreAuthorize("hasAnyRole('ADMIN','MANAGER','RECEPTIONIST')")
 public Visit create(@Valid @RequestBody NewVisit x){
  Patient p=patients.findById(x.patientId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Patient not found"));
  return visits.save(new Visit(p));
 }

 @GetMapping
 @PreAuthorize("hasAnyRole('ADMIN','MANAGER','RECEPTIONIST','DOCTOR','NURSE','RECORDS_OFFICER','LAB_TECHNICIAN','PHARMACIST','CASHIER','ACCOUNTANT')")
 public List<Visit> list(){return visits.findTop100ByOrderByRegisteredAtDesc();}

 @PatchMapping("/{id}/triage")
 @Transactional
 @PreAuthorize("hasAnyRole('ADMIN','MANAGER','NURSE')")
 public Visit triage(@PathVariable Long id,@Valid @RequestBody Triage x,Authentication auth){
  Visit v=visits.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Visit not found"));
  if("COMPLETED".equals(v.getStatus())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Completed visits cannot be edited");
  String notes=x.nurseNotes()!=null?x.nurseNotes():x.notes();
  v.recordTriage(x.bloodPressure(),x.temperature(),x.weight(),x.height(),x.pulseRate(),
      x.respiratoryRate(),x.oxygenSaturation(),notes,x.priority(),auth.getName());
  return visits.save(v);
 }

 @PatchMapping("/{id}/consultation")
 @Transactional
 @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
 public Visit consult(@PathVariable Long id,@Valid @RequestBody Consultation x,Authentication auth){
  Visit v=visits.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Visit not found"));
  if(!List.of("WAITING_FOR_DOCTOR","RESULTS_READY_FOR_DOCTOR","AWAITING_LAB","CONSULTATION_COMPLETED").contains(v.getStatus()))
   throw new ResponseStatusException(HttpStatus.CONFLICT,"Nurse triage must be completed before consultation");
  v.setSymptoms(x.symptoms());v.setSymptomDuration(x.symptomDuration());v.setMedicalHistory(x.medicalHistory());
  v.setExamination(x.examination());v.setProvisionalDiagnosis(x.provisionalDiagnosis());
  v.setConsultationNotes(x.consultationNotes());v.setDiagnosis(x.diagnosis());v.setAdvice(x.advice());
  v.setMedicineInstructions(x.medicineInstructions());v.setDoctorUsername(auth.getName());
  v.setDepartment(x.requiresLab()?"LABORATORY":"PHARMACY_OR_BILLING");
  v.setStatus(x.requiresLab()?"AWAITING_LAB":"CONSULTATION_COMPLETED");
  return visits.save(v);
 }

 @PatchMapping("/{id}/complete")
 @PreAuthorize("hasAnyRole('ADMIN','MANAGER','DOCTOR','RECORDS_OFFICER')")
 public Visit complete(@PathVariable Long id){
  Visit v=visits.findById(id).orElseThrow();
  if(!"CONSULTATION_COMPLETED".equals(v.getStatus()))
   throw new ResponseStatusException(HttpStatus.CONFLICT,"Doctor must complete consultation and review all requested lab results before closing this visit");
  v.setStatus("COMPLETED");v.setDepartment("CLOSED");return visits.save(v);
 }
}
