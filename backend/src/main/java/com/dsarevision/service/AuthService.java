package com.dsarevision.service;

import com.dsarevision.config.JwtService;
import com.dsarevision.dto.AuthResponseDto;
import com.dsarevision.dto.LoginRequestDto;
import com.dsarevision.dto.RegisterRequestDto;
import com.dsarevision.dto.UserSummaryDto;
import com.dsarevision.entity.User;
import com.dsarevision.exception.ApiException;
import com.dsarevision.exception.ResourceNotFoundException;
import com.dsarevision.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponseDto register(RegisterRequestDto request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ApiException("An account with this email address already exists", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        UserSummaryDto userSummary = new UserSummaryDto(user.getId(), user.getName(), user.getEmail());

        return new AuthResponseDto(token, userSummary);
    }

    @Transactional(readOnly = true)
    public AuthResponseDto login(LoginRequestDto request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        UserSummaryDto userSummary = new UserSummaryDto(user.getId(), user.getName(), user.getEmail());

        return new AuthResponseDto(token, userSummary);
    }

    @Transactional(readOnly = true)
    public UserSummaryDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return new UserSummaryDto(user.getId(), user.getName(), user.getEmail());
    }
}
