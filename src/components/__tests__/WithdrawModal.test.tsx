import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WithdrawModal } from '../WithdrawModal';

const baseProps = {
  open: true,
  onClose: vi.fn(),
  accessToken: 'test-token',
  userId: 'user-1',
  balance: 50000,
  onSuccess: vi.fn(),
};

describe('WithdrawModal', () => {
  it('renders amount and phone inputs', () => {
    render(<WithdrawModal {...baseProps} />);
    expect(screen.getByPlaceholderText(/kiasi/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/namba/i)).toBeInTheDocument();
  });

  it('disables confirm when amount exceeds balance', () => {
    render(<WithdrawModal {...baseProps} />);
    fireEvent.click(screen.getByText('M-Pesa'));
    const amountInput = screen.getByPlaceholderText(/kiasi/i);
    fireEvent.change(amountInput, { target: { value: '100000' } });
    const phoneInput = screen.getByPlaceholderText(/namba/i);
    fireEvent.change(phoneInput, { target: { value: '+255712345678' } });
    const button = screen.getByRole('button', { name: /thibitisha/i });
    expect(button).toBeDisabled();
  });

  it('enables confirm when amount is within balance and phone is set', () => {
    render(<WithdrawModal {...baseProps} />);
    fireEvent.click(screen.getByText('M-Pesa'));
    const amountInput = screen.getByPlaceholderText(/kiasi/i);
    fireEvent.change(amountInput, { target: { value: '10000' } });
    const phoneInput = screen.getByPlaceholderText(/namba/i);
    fireEvent.change(phoneInput, { target: { value: '+255712345678' } });
    const button = screen.getByRole('button', { name: /thibitisha/i });
    expect(button).not.toBeDisabled();
  });
});
