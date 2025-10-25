package com.cafe.cafe_backend.service;

import com.cafe.cafe_backend.dto.*;
import com.cafe.cafe_backend.entity.Role;
import com.cafe.cafe_backend.entity.User;
import com.cafe.cafe_backend.repository.UserRepository;
import com.cafe.cafe_backend.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public void register(@Valid RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new IllegalArgumentException("Username đã tồn tại");
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalArgumentException("Email đã tồn tại");

        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .roles(Set.of(Role.USER))
                .build();

        // Nếu là user đầu tiên -> gán ADMIN
        if (userRepository.count() == 0) {
            user.setRoles(Set.of(Role.ADMIN));
        }

        userRepository.save(user);
    }

    public AuthResponse login(@Valid LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsernameOrEmail(), req.getPassword())
        );

        String username = auth.getName();
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", auth.getAuthorities());

        String token = jwtService.generateToken(username, claims);

        return new AuthResponse(token);
    }
}
