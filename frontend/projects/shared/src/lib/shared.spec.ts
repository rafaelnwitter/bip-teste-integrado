import { ButtonComponent } from './button/button';
import { CardComponent } from './card/card';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog';
import { LoadingComponent } from './loading/loading';

describe('Shared Library Exports', () => {
  it('should export ButtonComponent', () => {
    expect(ButtonComponent).toBeTruthy();
  });

  it('should export CardComponent', () => {
    expect(CardComponent).toBeTruthy();
  });

  it('should export ConfirmDialogComponent', () => {
    expect(ConfirmDialogComponent).toBeTruthy();
  });

  it('should export LoadingComponent', () => {
    expect(LoadingComponent).toBeTruthy();
  });
});
