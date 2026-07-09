package com.civicvoice.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserProfileUpdateRequest(
    @NotBlank(message = "Name cannot be blank")
    @Size(max = 100)
    String name,
    
    @Size(max = 255)
    String about,
    
    @Size(max = 255)
    String avatarUrl
) {}
