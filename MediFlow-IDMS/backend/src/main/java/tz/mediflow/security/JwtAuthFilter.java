
package tz.mediflow.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtService jwt;
    private final UserDetailsService users;

    public JwtAuthFilter(JwtService jwt, UserDetailsService users) {
        this.jwt = jwt;
        this.users = users;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return "/api/auth/login".equals(request.getServletPath())
                || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain
    ) throws ServletException, IOException {

        String header = req.getHeader(HttpHeaders.AUTHORIZATION);

        if (header == null || !header.startsWith("Bearer ")) {
            log.warn("JWT missing for request: {} {}", 
                    req.getMethod(), req.getServletPath());

            chain.doFilter(req, res);
            return;
        }

        try {
            String token = header.substring(7).trim();

            String username = jwt.username(token);

            var userDetails = users.loadUserByUsername(username);

            if (!userDetails.isEnabled()) {
                res.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                        "User account is disabled");
                return;
            }

            var authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(req)
            );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

            log.info("JWT authenticated user: {}, authorities: {}",
                    username, userDetails.getAuthorities());

        } catch (JwtException | IllegalArgumentException ex) {

            SecurityContextHolder.clearContext();

            log.warn("Invalid or expired JWT: {}", ex.getMessage());

            res.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired authentication token");
            return;

        } catch (Exception ex) {

            SecurityContextHolder.clearContext();

            log.error("JWT authentication failed", ex);

            res.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                    "Authentication failed");
            return;
        }

        chain.doFilter(req, res);
    }
}
