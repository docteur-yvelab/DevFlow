package com.devflow.devflow_api.config;

import com.devflow.devflow_api.model.Role;
import com.devflow.devflow_api.model.User;
import com.devflow.devflow_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // On vérifie si un admin existe déjà pour ne pas le recréer à chaque démarrage
        if (userRepository.findByEmail("admin@devflow.com").isEmpty()) {
            User admin = User.builder()
                    .username("admin_master")
                    .email("admin@devflow.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);
            System.out.println(" Compte administrateur créé par défaut (admin@devflow.com / admin123)");
        }
    }
}