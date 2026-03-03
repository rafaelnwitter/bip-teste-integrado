import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfirmDialogComponent } from './confirm-dialog';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should not be visible by default', () => {
      expect(component.visivel).toBe(false);
    });

    it('should have default title', () => {
      expect(component.titulo).toBe('Confirmação');
    });

    it('should have default message', () => {
      expect(component.mensagem).toBe('Tem certeza?');
    });
  });

  describe('visibility', () => {
    it('should not render dialog when not visible', () => {
      component.visivel = false;
      fixture.detectChanges();
      const overlay = fixture.nativeElement.querySelector('.overlay');
      expect(overlay).toBeNull();
    });

    it('should render dialog when visible', () => {
      component.visivel = true;
      fixture.detectChanges();
      const overlay = fixture.nativeElement.querySelector('.overlay');
      expect(overlay).toBeTruthy();
    });

    it('should show title in dialog', () => {
      component.visivel = true;
      component.titulo = 'Excluir Item';
      fixture.detectChanges();
      const title = fixture.nativeElement.querySelector('.dialog h3');
      expect(title?.textContent).toContain('Excluir Item');
    });

    it('should show message in dialog', () => {
      component.visivel = true;
      component.mensagem = 'Deseja excluir?';
      fixture.detectChanges();
      const message = fixture.nativeElement.querySelector('.dialog p');
      expect(message?.textContent).toContain('Deseja excluir?');
    });
  });

  describe('outputs', () => {
    it('should emit confirmar event when confirm button is clicked', () => {
      component.visivel = true;
      fixture.detectChanges();

      const confirmSpy = vi.fn();
      component.confirmar.subscribe(confirmSpy);

      const buttons = fixture.nativeElement.querySelectorAll('lib-button');
      const confirmBtn = buttons[0];
      confirmBtn.dispatchEvent(new CustomEvent('clicked'));

      expect(confirmSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit cancelar event when cancel button is clicked', () => {
      component.visivel = true;
      fixture.detectChanges();

      const cancelSpy = vi.fn();
      component.cancelar.subscribe(cancelSpy);

      const buttons = fixture.nativeElement.querySelectorAll('lib-button');
      const cancelBtn = buttons[1];
      cancelBtn.dispatchEvent(new CustomEvent('clicked'));

      expect(cancelSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit cancelar event when overlay is clicked', () => {
      component.visivel = true;
      fixture.detectChanges();

      const cancelSpy = vi.fn();
      component.cancelar.subscribe(cancelSpy);

      const overlay = fixture.nativeElement.querySelector('.overlay');
      overlay.click();

      expect(cancelSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit cancelar when dialog body is clicked (stopPropagation)', () => {
      component.visivel = true;
      fixture.detectChanges();

      const cancelSpy = vi.fn();
      component.cancelar.subscribe(cancelSpy);

      const dialog = fixture.nativeElement.querySelector('.dialog');
      dialog.click();

      expect(cancelSpy).not.toHaveBeenCalled();
    });
  });

  describe('structure', () => {
    it('should have actions section with two buttons when visible', () => {
      component.visivel = true;
      fixture.detectChanges();
      const actions = fixture.nativeElement.querySelector('.actions');
      expect(actions).toBeTruthy();
      const buttons = actions.querySelectorAll('lib-button');
      expect(buttons.length).toBe(2);
    });
  });
});
