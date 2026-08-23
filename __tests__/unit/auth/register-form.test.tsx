// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/components/auth/register-form";

const {
  mockRegister,
  mockClose,
  mockDiscordLogin,
  mockToastSuccess,
  mockToastError,
} = vi.hoisted(() => ({
  mockRegister: vi.fn(),
  mockClose: vi.fn(),
  mockDiscordLogin: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockToastError: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/hooks/auth/use-register", () => ({
  default: () => ({ register: mockRegister, isLoading: false }),
}));

vi.mock("@/hooks/auth/use-auth-dialog", () => ({
  default: () => ({ close: mockClose, setView: vi.fn() }),
}));

vi.mock("@/hooks/auth/use-discord-login", () => ({
  default: () => ({ discordLogin: mockDiscordLogin, isSocialLoading: false }),
}));

vi.mock("sonner", () => ({
  toast: { success: mockToastSuccess, error: mockToastError },
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not submit an invalid email", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText<HTMLInputElement>(/email/i);
    await user.type(emailInput, "not-an-email");
    await user.type(screen.getByLabelText(/nickname/i), "jankowalski");
    await user.type(screen.getByLabelText(/password/i), "Secret123");
    await user.click(screen.getByRole("button", { name: /^register$/i }));

    expect(emailInput.validity.typeMismatch).toBe(true);
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("shows an inline field error on a too-short password on submit", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, "short");
    await user.click(screen.getByRole("button", { name: /^register$/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least/i)).toBeDefined();
      expect(passwordInput).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("shows an inline field error on invalid nickname characters on submit", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const nicknameInput = screen.getByLabelText(/nickname/i);
    await user.type(nicknameInput, "jan kowalski");
    await user.click(screen.getByRole("button", { name: /^register$/i }));

    await waitFor(() => {
      expect(screen.getByText(/only letters, numbers/i)).toBeDefined();
      expect(nicknameInput).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("shows no field errors on blur before a submit attempt", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nickname/i), "ab");
    await user.tab();

    expect(screen.queryByText(/nickname must be at least/i)).toBeNull();
    expect(screen.getByLabelText(/nickname/i)).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });

  it("does not show field errors for valid input", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/email/i), "valid@example.com");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toHaveAttribute(
        "aria-invalid",
        "false",
      );
    });
  });

  it("calls register with form values on valid submit", async () => {
    mockRegister.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nickname/i), "jankowalski");
    await user.type(screen.getByLabelText(/email/i), "jankowalski@example.com");
    await user.type(screen.getByLabelText(/password/i), "Abcdef1");
    await user.click(screen.getByRole("button", { name: /^register$/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        nickname: "jankowalski",
        email: "jankowalski@example.com",
        password: "Abcdef1",
      });
    });
  });

  it("shows a success toast and closes the dialog on success", async () => {
    mockRegister.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nickname/i), "jankowalski");
    await user.type(screen.getByLabelText(/email/i), "jan@example.com");
    await user.type(screen.getByLabelText(/password/i), "Abcdef1");
    await user.click(screen.getByRole("button", { name: /^register$/i }));

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Check your inbox - we sent you a confirmation link.",
      );
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it("shows an error toast and keeps the dialog open on failure", async () => {
    mockRegister.mockResolvedValue({
      error: new Error("Nickname already taken."),
    });
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nickname/i), "jankowalski");
    await user.type(screen.getByLabelText(/email/i), "jan@example.com");
    await user.type(screen.getByLabelText(/password/i), "Abcdef1");
    await user.click(screen.getByRole("button", { name: /^register$/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Nickname already taken.");
    });
    expect(mockClose).not.toHaveBeenCalled();
  });
});
