import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('affiche son libellé', () => {
    render(<Button>Enregistrer</Button>);
    expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeInTheDocument();
  });

  it('déclenche onClick au clic', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Valider</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('est désactivé pendant le chargement et ne déclenche pas onClick', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Envoi
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});
