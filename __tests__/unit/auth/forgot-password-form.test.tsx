// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

const { hookState, mockToastSuccess, mockToastError } = vi.hoisted(() => ({
  hookState: {
    resetPassword: vi.fn(),
    isLoading: false,
    success: false,
  },
  mockToastSuccess: vi.fn(),
  mockToastError: vi.fn(),
}));

vi.mock("@/hooks/auth/use-forgot-password", () => ({
  default: () => hookState,
}));

vi.mock("sonner", () => ({
  toast: { success: mockToastSuccess, error: mockToastError },
}));

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookState.isLoading = false;
    hookState.success = false;
  });

  it("does not submit an invalid email", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    const email = screen.getByLabelText<HTMLInputElement>(/email/i);
    await user.type(email, "not-an-email");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(email.validity.typeMismatch).toBe(true);
    expect(hookState.resetPassword).not.toHaveBeenCalled();
  });

  it("shows no error on blur before a submit attempt", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    const email = screen.getByLabelText(/email/i);
    await user.click(email);
    await user.tab();

    expect(email).toHaveAttribute("aria-invalid", "false");
    expect(hookState.resetPassword).not.toHaveBeenCalled();
  });

  it("calls resetPaswword on valid submit", async () => {
    hookState.resetPassword.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(hookState.resetPassword).toHaveBeenCalledWith("user@example.com");
    });
  });

  it("shows a success toast on success", async () => {
    hookState.resetPassword.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Check your inbox - we sent you a reset link.",
      );
    });
  });

  it("shows an error toast on failure", async () => {
    hookState.resetPassword.mockResolvedValue({
      error: new Error("Too many requests"),
    });
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Too many requests");
    });
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });
});
