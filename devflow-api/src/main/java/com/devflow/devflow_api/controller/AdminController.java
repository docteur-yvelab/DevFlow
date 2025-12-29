package com.devflow.devflow_api.controller;

import com.devflow.devflow_api.auth.AuthenticationResponse;
import com.devflow.devflow_api.auth.AuthenticationService;
import com.devflow.devflow_api.auth.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final AuthenticationService authService;

    public AdminController(AuthenticationService authService) {
        this.authService = authService;
    }

    @PostMapping("/create-user")
    public ResponseEntity<AuthenticationResponse> registerByAdmin(@RequestBody RegisterRequest request) {
        // On réutilise ta logique de register existante
        return ResponseEntity.ok(authService.register(request));
    }
}
