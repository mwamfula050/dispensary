package tz.mediflow.controller;
import tz.mediflow.model.*; import tz.mediflow.repo.UserRepo; import tz.mediflow.security.JwtService;
import jakarta.validation.Valid; import jakarta.validation.constraints.*; import org.springframework.http.*; import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final UserRepo users;private final PasswordEncoder encoder;private final JwtService jwt;
 public AuthController(UserRepo users,PasswordEncoder encoder,JwtService jwt){this.users=users;this.encoder=encoder;this.jwt=jwt;}
 public record Login(@NotBlank String username,@NotBlank String password){}
 @PostMapping("/login") public Map<String,Object> login(@Valid @RequestBody Login in){
  AppUser u=users.findByUsername(in.username().trim()).orElseThrow(()->new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid username or password"));
  if(!u.isEnabled()||!encoder.matches(in.password(),u.getPasswordHash()))throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid username or password");
  return Map.of("token",jwt.generate(u.getUsername(),u.getRole().name()),"username",u.getUsername(),"fullName",u.getFullName(),"role",u.getRole().name());
 }
}
