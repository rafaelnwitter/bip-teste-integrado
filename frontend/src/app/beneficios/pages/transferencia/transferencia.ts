import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Beneficio, BeneficioService, LoadingComponent } from 'shared';

@Component({
  selector: 'app-transferencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './transferencia.html',
  styleUrl: './transferencia.css',
})
export class TransferenciaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(BeneficioService);
  private readonly cdr = inject(ChangeDetectorRef);

  form!: FormGroup;
  beneficios: Beneficio[] = [];
  loading = true;
  erro = '';
  sucesso = '';

  ngOnInit(): void {
    this.form = this.fb.group({
      fromId: [null, Validators.required],
      toId: [null, Validators.required],
      valor: [null, [Validators.required, Validators.min(0.01)]],
    });

    this.carregarBeneficios();
  }

  carregarBeneficios(): void {
    this.loading = true;
    this.erro = '';

    this.service.listar().pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.beneficios = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Erro ao carregar benefícios';
        this.cdr.detectChanges();
      }
    });
  }

  transferir(): void {
    if (this.form.invalid) return;

    const { fromId, toId, valor } = this.form.value;

    if (fromId === toId) {
      this.erro = 'Origem e destino devem ser diferentes';
      return;
    }

    // Validação de saldo insuficiente
    const saldoOrigem = this.getValor(fromId);
    if (valor > saldoOrigem) {
      this.erro = `Saldo insuficiente. Disponível: R$ ${saldoOrigem.toFixed(2)}`;
      return;
    }

    this.loading = true;
    this.erro = '';
    this.sucesso = '';

    this.service.transferir({ fromId, toId, valor })
      .subscribe({
        next: () => {
          this.sucesso = 'Transferência realizada com sucesso!';
          this.cdr.detectChanges();
          this.form.reset();
          // carregarBeneficios() gerencia o loading
          this.carregarBeneficios();
        },
        error: (err) => {
          this.loading = false;
          const body = err.error;
          this.erro =
            (typeof body === 'object' && body?.erro) ||
            (typeof body === 'string' && body) ||
            err.message ||
            'Erro ao realizar transferência';
          this.cdr.detectChanges();
        },
      });
  }

  getNome(id: number): string {
    return this.beneficios.find((b) => b.id === id)?.nome || '';
  }

  getValor(id: number): number {
    return this.beneficios.find((b) => b.id === id)?.valor || 0;
  }
}
