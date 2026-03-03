import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-wrapper" *ngIf="visivel">
      <div class="spinner"></div>
      <p>{{ mensagem }}</p>
    </div>
  `,
  styles: [`
    .loading-wrapper { display: flex; flex-direction: column; align-items: center; padding: 32px; }
    .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #1976d2; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingComponent {
  @Input() visivel = true;
  @Input() mensagem = 'Carregando...';
}
