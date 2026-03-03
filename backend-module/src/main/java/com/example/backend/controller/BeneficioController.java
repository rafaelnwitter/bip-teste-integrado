package com.example.backend.controller;

import com.example.backend.dto.BeneficioDTO;
import com.example.backend.dto.TransferDTO;
import com.example.backend.service.BeneficioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/beneficios")
@Tag(name = "Beneficios", description = "Operações relacionadas a benefícios")
public class BeneficioController {

    private final BeneficioService service;

    public BeneficioController(BeneficioService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listar todos os benefícios ativos")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    public ResponseEntity<List<BeneficioDTO>> listar() {
        return ResponseEntity.ok(service.listarAtivos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar benefício por ID")
    @ApiResponse(responseCode = "200", description = "Benefício encontrado")
    @ApiResponse(responseCode = "404", description = "Benefício não encontrado")
    public ResponseEntity<BeneficioDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Criar novo benefício")
    @ApiResponse(responseCode = "201", description = "Benefício criado com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    public ResponseEntity<BeneficioDTO> criar(@RequestBody @Valid BeneficioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar benefício existente")
    @ApiResponse(responseCode = "200", description = "Benefício atualizado com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    @ApiResponse(responseCode = "404", description = "Benefício não encontrado")
    public ResponseEntity<BeneficioDTO> atualizar(@PathVariable Long id,
                                                   @RequestBody @Valid BeneficioDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar benefício por ID")
    @ApiResponse(responseCode = "204", description = "Benefício deletado com sucesso")
    @ApiResponse(responseCode = "404", description = "Benefício não encontrado")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/transferir")
    @Operation(summary = "Transferir valor entre benefícios",
               description = "Transfere um valor do benefício de origem para o destino, com validação de saldo e locking")
    @ApiResponse(responseCode = "200", description = "Transferência realizada com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos ou IDs iguais")
    @ApiResponse(responseCode = "404", description = "Benefício não encontrado")
    @ApiResponse(responseCode = "422", description = "Saldo insuficiente")
    public ResponseEntity<Void> transferir(@RequestBody @Valid TransferDTO dto) {
        service.transferir(dto);
        return ResponseEntity.ok().build();
    }
}
