package tz.mediflow.controller;

import tz.mediflow.model.Patient;
import tz.mediflow.model.Visit;
import tz.mediflow.repo.PatientRepo;
import tz.mediflow.repo.VisitRepo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
 private final PatientRepo repo;
 private final VisitRepo visits;
 public PatientController(PatientRepo r, VisitRepo v){repo=r;visits=v;}

 public record PatientRequest(@NotBlank @Size(max=160) String fullName, LocalDate dateOfBirth,
     @NotBlank String sex, String phone, String address, String nextOfKin, String nextOfKinPhone){}

 @PostMapping
 @Transactional
 @PreAuthorize("hasAnyRole('ADMIN','MANAGER','RECEPTIONIST','RECORDS_OFFICER')")
 public Patient create(@Valid @RequestBody PatientRequest x){
  String no="MF-"+UUID.randomUUID().toString().substring(0,8).toUpperCase();
  Patient patient=repo.save(new Patient(no,x.fullName().trim(),x.dateOfBirth(),x.sex(),x.phone(),x.address(),x.nextOfKin(),x.nextOfKinPhone()));
  // Every new registration automatically opens the first visit and routes it to nursing triage.
  visits.save(new Visit(patient));
  return patient;
 }

 @GetMapping
 @PreAuthorize("hasAnyRole('ADMIN','MANAGER','RECEPTIONIST','RECORDS_OFFICER','DOCTOR','NURSE')")
 public List<Patient> search(@RequestParam(defaultValue="") String q){
  return repo.findTop100ByFullNameContainingIgnoreCaseOrPatientNumberContainingIgnoreCase(q,q);
 }

 @GetMapping("/{id}")
 @PreAuthorize("hasAnyRole('ADMIN','MANAGER','RECEPTIONIST','RECORDS_OFFICER','DOCTOR','NURSE','LAB_TECHNICIAN')")
 public Patient one(@PathVariable Long id){
  return repo.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Patient not found"));
 }
}
