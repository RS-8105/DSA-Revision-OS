package com.dsarevision.controller;

import com.dsarevision.dto.DashboardResponseDto;
import com.dsarevision.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponseDto> getDashboard(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsarevision.config.UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getDashboard(principal.getId()));
    }
}
