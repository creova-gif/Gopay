import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TopUpModal } from '../TopUpModal';

const baseProps = {
  open: true,
  onClose: vi.fn(),
  accessToken: 'test-token',
  userId: 'user-1',
  onSuccess: vi.fn(),
};

describe('TopUpModal', () => {
  it('renders network selector options', () => {
    render(<TopUpModal {...baseProps} />);
    expect(screen.getByText('M-Pesa')).toBeInTheDocument();
    expect(screen.getByText('Tigo Pesa')).toBeInTheDocument();
    expect(screen.getByText('Airtel Money')).toBeInTheDocument();
    expect(screen.getByText('HaloPesa')).toBeInTheDocument();
    expect(screen.getByText('Card')).toBeInTheDocument();
  });

  it('disables confirm button when amount is empty', () => {
    render(<TopUpModal {...baseProps} />);
    const button = screen.getByRole('button', { name: /thibitisha/i });
    expect(button).toBeDisabled();
  });

  it('enables confirm button when network and amount are set', () => {
    render(<TopUpModal {...baseProps} />);
    fireEvent.click(screen.getByText('M-Pesa'));
    const input = screen.getByPlaceholderText(/kiasi/i);
    fireEvent.change(input, { target: { value: '10000' } });
    const button = screen.getByRole('button', { name: /thibitisha/i });
    expect(button).not.toBeDisabled();
  });

  it('calls onClose when cancel button clicked', () => {
    const onClose = vi.fn();
    render(<TopUpModal {...baseProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /ghairi/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
