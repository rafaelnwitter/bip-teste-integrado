import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'lib-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="overlay" *ngIf="visivel" (click)="cancelar.emit()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <h3>{{ titulo }}</h3>
        <p>{{ mensagem }}</p>
        <div class="actions">
          <lib-button variant="danger" (clicked)="confirmar.emit()">Confirmar</lib-button>
          <lib-button variant="secondary" (clicked)="cancelar.emit()">Cancelar</lib-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog { background: white; padding: 24px; border-radius: 8px; min-width: 320px; }
    .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
  `]
})
export class ConfirmDialogComponent {
  @Input() visivel = false;
  @Input() titulo = 'Confirmação';
  @Input() mensagem = 'Tem certeza?';
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
}
