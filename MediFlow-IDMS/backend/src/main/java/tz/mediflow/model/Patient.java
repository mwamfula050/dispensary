package tz.mediflow.model;

import jakarta.persistence.*;
import java.time.*;

@Entity
@Table(name="patients", indexes=@Index(name="idx_patient_name", columnList="full_name"))
public class Patient {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false, unique=true, length=40) private String patientNumber;
 @Column(nullable=false,length=160) private String fullName;
 private LocalDate dateOfBirth;
 @Column(length=20) private String sex;
 @Column(length=40) private String phone;
 @Column(length=180) private String address;
 @Column(length=80) private String nextOfKin;
 @Column(length=40) private String nextOfKinPhone;
 @Column(nullable=false,updatable=false) private Instant createdAt=Instant.now();
 protected Patient(){}
 public Patient(String number,String name,LocalDate dob,String sex,String phone,String address,String kin,String kinPhone){
  this.patientNumber=number;this.fullName=name;this.dateOfBirth=dob;this.sex=sex;this.phone=phone;this.address=address;this.nextOfKin=kin;this.nextOfKinPhone=kinPhone;
 }
 public Long getId(){return id;} public String getPatientNumber(){return patientNumber;} public String getFullName(){return fullName;}
 public LocalDate getDateOfBirth(){return dateOfBirth;} public String getSex(){return sex;} public String getPhone(){return phone;}
 public String getAddress(){return address;} public String getNextOfKin(){return nextOfKin;} public String getNextOfKinPhone(){return nextOfKinPhone;}
}
