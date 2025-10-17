package com.example.demo.controller;

import com.example.demo.dto.CountdownDTO;
import com.example.demo.service.CountdownService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/countdown")
public class CountdownController {

    @Autowired
    private CountdownService countdownService;

    @GetMapping
    public ResponseEntity<CountdownDTO> getCountdown() {
        CountdownDTO countdown = countdownService.getCountdown();
        return ResponseEntity.ok(countdown);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('COUNTDOWN:EDIT') or hasAuthority('COUNTDOWN:CREATE') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<CountdownDTO> saveCountdown(@RequestBody CountdownDTO countdownDTO) {
        CountdownDTO savedCountdown = countdownService.saveCountdown(countdownDTO);
        return ResponseEntity.ok(savedCountdown);
    }
}