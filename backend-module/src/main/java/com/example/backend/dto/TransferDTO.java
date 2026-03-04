package com.example.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@Schema(description = "DTO para transferência de valor entre benefícios")
public record TransferDTO(
    @NotNull(message = "ID de origem é obrigatório")
    @Schema(description = "ID do benefício de origem", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    Long fromId,

    @NotNull(message = "ID de destino é obrigatório")
    @Schema(description = "ID do benefício de destino", example = "2", requiredMode = Schema.RequiredMode.REQUIRED)
    Long toId,

    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "Valor deve ser maior que zero")
    @Schema(description = "Valor a ser transferido", example = "250.00", requiredMode = Schema.RequiredMode.REQUIRED)
    BigDecimal valor
) {}
