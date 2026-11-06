package tz.mediflow.model;
import jakarta.persistence.*; import java.math.BigDecimal; import java.time.*;
@Entity @Table(name="payments")
public class Payment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Invoice invoice;
 @Column(nullable=false,precision=12,scale=2) private BigDecimal amount;
 @Column(nullable=false,length=30) private String method;
 @Column(length=100) private String reference;
 @Column(nullable=false,updatable=false) private Instant paidAt=Instant.now();
 @Column(nullable=false,length=80) private String receivedBy;
 protected Payment(){}
 public Payment(Invoice invoice,BigDecimal amount,String method,String reference,String by){this.invoice=invoice;this.amount=amount;this.method=method;this.reference=reference;this.receivedBy=by;}
 public Long getId(){return id;} public Invoice getInvoice(){return invoice;} public BigDecimal getAmount(){return amount;}
 public String getMethod(){return method;} public String getReference(){return reference;} public Instant getPaidAt(){return paidAt;}
 public String getReceivedBy(){return receivedBy;}
}
