package tz.mediflow.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "visits")
public class Visit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false, updatable = false)
    private Instant registeredAt = Instant.now();

    @Column(nullable = false, length = 40)
    private String status = "WAITING_FOR_TRIAGE";

    @Column(length = 40) private String department = "NURSE";

    @Column(length = 30) private String priority = "NORMAL";
    @Column(length = 30) private String bloodPressure;
    private Double temperature;
    private Double weight;
    private Double height;
    private Integer pulseRate;
    private Integer respiratoryRate;
    private Double oxygenSaturation;
    @Column(length = 3000) private String nurseNotes;
    @Column(length = 100) private String triagedBy;
    private Instant triagedAt;

    @Column(length = 1000) private String triageNotes;
    @Column(length = 3000) private String symptoms;
    @Column(length = 500) private String symptomDuration;
    @Column(length = 3000) private String medicalHistory;
    @Column(length = 3000) private String examination;
    @Column(length = 1000) private String provisionalDiagnosis;
    @Column(length = 1000) private String diagnosis;
    @Column(length = 3000) private String consultationNotes;
    @Column(length = 3000) private String advice;
    @Column(length = 3000) private String medicineInstructions;
    @Column(length = 100) private String doctorUsername;

    protected Visit() {}
    public Visit(Patient patient) { this.patient = patient; }

    public Long getId(){return id;} public Patient getPatient(){return patient;}
    public Instant getRegisteredAt(){return registeredAt;} public String getStatus(){return status;}
    public String getDepartment(){return department;} public String getPriority(){return priority;}
    public String getBloodPressure(){return bloodPressure;} public Double getTemperature(){return temperature;}
    public Double getWeight(){return weight;} public Double getHeight(){return height;}
    public Integer getPulseRate(){return pulseRate;} public Integer getRespiratoryRate(){return respiratoryRate;}
    public Double getOxygenSaturation(){return oxygenSaturation;} public String getNurseNotes(){return nurseNotes;}
    public String getTriagedBy(){return triagedBy;} public Instant getTriagedAt(){return triagedAt;}
    public String getTriageNotes(){return triageNotes;} public String getSymptoms(){return symptoms;}
    public String getSymptomDuration(){return symptomDuration;} public String getMedicalHistory(){return medicalHistory;}
    public String getExamination(){return examination;} public String getProvisionalDiagnosis(){return provisionalDiagnosis;}
    public String getDiagnosis(){return diagnosis;} public String getConsultationNotes(){return consultationNotes;}
    public String getAdvice(){return advice;} public String getMedicineInstructions(){return medicineInstructions;}
    public String getDoctorUsername(){return doctorUsername;}

    public void recordTriage(String bp, Double temp, Double wt, Double ht, Integer pulse,
            Integer respiratory, Double spo2, String notes, String priority, String nurse) {
        this.bloodPressure=bp; this.temperature=temp; this.weight=wt; this.height=ht;
        this.pulseRate=pulse; this.respiratoryRate=respiratory; this.oxygenSaturation=spo2;
        this.nurseNotes=notes; this.triageNotes=notes; this.priority=priority==null?"NORMAL":priority;
        this.triagedBy=nurse; this.triagedAt=Instant.now();
        this.status="WAITING_FOR_DOCTOR"; this.department="DOCTOR";
    }
    public void setStatus(String s){status=s;} public void setDepartment(String d){department=d;}
    public void setSymptoms(String s){symptoms=s;} public void setSymptomDuration(String s){symptomDuration=s;}
    public void setMedicalHistory(String s){medicalHistory=s;} public void setExamination(String s){examination=s;}
    public void setProvisionalDiagnosis(String s){provisionalDiagnosis=s;} public void setConsultationNotes(String s){consultationNotes=s;}
    public void setDiagnosis(String s){diagnosis=s;} public void setAdvice(String s){advice=s;}
    public void setMedicineInstructions(String s){medicineInstructions=s;} public void setDoctorUsername(String s){doctorUsername=s;}
    public void setPriority(String s){priority=s;}
}
