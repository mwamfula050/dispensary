package tz.mediflow.model;
import jakarta.persistence.*; import java.time.*;
@Entity @Table(name="lab_orders")
public class LabOrder {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Visit visit;
 @Column(nullable=false,length=120) private String testName;
 @Column(nullable=false,length=30) private String status="REQUESTED";
 @Column(length=1000) private String result;
 @Column(length=1000) private String interpretation;
 @Column(length=80) private String specimenCode;
 private Instant requestedAt=Instant.now(); private Instant verifiedAt;
 @Column(length=80) private String verifiedBy;
 protected LabOrder(){}
 public LabOrder(Visit visit,String test){this.visit=visit;this.testName=test;}
 public Long getId(){return id;} public Visit getVisit(){return visit;} public String getTestName(){return testName;}
 public String getStatus(){return status;} public String getResult(){return result;} public String getInterpretation(){return interpretation;}
 public Instant getRequestedAt(){return requestedAt;} public Instant getVerifiedAt(){return verifiedAt;}
 public String getSpecimenCode(){return specimenCode;} public String getVerifiedBy(){return verifiedBy;}
 public void setResult(String r){result=r;} public void setInterpretation(String i){interpretation=i;}
 public void setStatus(String s){status=s;} public void setSpecimenCode(String s){specimenCode=s;}
 public void verify(String by){status="VERIFIED";verifiedBy=by;verifiedAt=Instant.now();}
}
