package tz.mediflow.controller;
import tz.mediflow.model.*;import tz.mediflow.repo.*;import jakarta.validation.Valid;import jakarta.validation.constraints.*;
import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.web.bind.annotation.*;import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;import java.util.*;
@RestController @RequestMapping("/api/billing")
public class BillingController {
 private final InvoiceRepo invoices;private final VisitRepo visits;private final PaymentRepo payments;
 public BillingController(InvoiceRepo i,VisitRepo v,PaymentRepo p){invoices=i;visits=v;payments=p;}
 public record NewInvoice(@NotNull Long visitId,@NotNull @DecimalMin("0.01") BigDecimal amount){}
 public record NewPayment(@NotNull @DecimalMin("0.01") BigDecimal amount,@NotBlank String method,String reference){}
 @PostMapping("/invoices") @PreAuthorize("hasAnyRole('ADMIN','MANAGER','CASHIER','ACCOUNTANT')") public Invoice invoice(@Valid @RequestBody NewInvoice x){return invoices.save(new Invoice(visits.findById(x.visitId()).orElseThrow(),x.amount()));}
 @GetMapping("/invoices") @PreAuthorize("hasAnyRole('ADMIN','MANAGER','CASHIER','ACCOUNTANT','RECORDS_OFFICER','DOCTOR')") public List<Invoice> invoices(){return invoices.findTop100ByOrderByCreatedAtDesc();}
 @PostMapping("/invoices/{id}/payments") @Transactional @PreAuthorize("hasAnyRole('ADMIN','MANAGER','CASHIER')") public Payment pay(@PathVariable Long id,@Valid @RequestBody NewPayment x,org.springframework.security.core.Authentication auth){
  Invoice i=invoices.findById(id).orElseThrow();if(i.getStatus().equals("PAID"))throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT,"Invoice already paid");
  if(i.getPaid().add(x.amount()).compareTo(i.getAmount())>0)throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST,"Payment exceeds balance");
  i.addPayment(x.amount());invoices.save(i);return payments.save(new Payment(i,x.amount(),x.method(),x.reference(),auth.getName()));
 }
 @GetMapping("/payments") @PreAuthorize("hasAnyRole('ADMIN','MANAGER','CASHIER','ACCOUNTANT','DOCTOR','RECORDS_OFFICER')") public List<Payment> payments(){return payments.findTop100ByOrderByPaidAtDesc();}
}
