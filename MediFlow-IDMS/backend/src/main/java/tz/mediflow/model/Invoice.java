package tz.mediflow.model;
import jakarta.persistence.*; import java.math.BigDecimal; import java.time.*;
@Entity @Table(name="invoices")
public class Invoice {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Visit visit;
 @Column(nullable=false,precision=12,scale=2) private BigDecimal amount;
 @Column(nullable=false,precision=12,scale=2) private BigDecimal paid=BigDecimal.ZERO;
 @Column(nullable=false,length=20) private String status="UNPAID";
 @Column(nullable=false,updatable=false) private Instant createdAt=Instant.now();
 protected Invoice(){}
 public Invoice(Visit visit,BigDecimal amount){this.visit=visit;this.amount=amount;}
 public Long getId(){return id;} public Visit getVisit(){return visit;} public BigDecimal getAmount(){return amount;}
 public BigDecimal getPaid(){return paid;} public String getStatus(){return status;} public Instant getCreatedAt(){return createdAt;}
 public void addPayment(BigDecimal value){paid=paid.add(value);status=paid.compareTo(amount)>=0?"PAID":"PARTIAL";}
}
