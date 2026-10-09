// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import RegisterForm from "@/components/auth/register-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/hooks/auth/use-discord-login", () => ({
  default: () => ({
    discordLogin: vi.fn(),
    isSocialLoading: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const registerMock = vi.fn();
vi.mock("@/hooks/auth/use-register", () => ({
  default: () => ({ register: registerMock, isLoading: false }),
}));

const closeMock = vi.fn();
vi.mock("@/hooks/auth/use-auth-dialog", () => ({
  default: () => ({ close: closeMock }),
}));

describe("register form submit toast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fires the 'check your inbox' toast and closes the dialog on submit success", async () => {
    registerMock.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nickname/i), "validnick");
    await user.type(screen.getByLabelText(/email/i), "valid@example.com");
    await user.type(screen.getByLabelText(/password/i), "ValidPass1");
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Check your inbox - we sent you a confirmation link.",
      );
      expect(closeMock).toHaveBeenCalled();
    });
  });

  it("shows a server-error toast and does not close the dialog on register failure", async () => {
    registerMock.mockResolvedValue({
      error: new Error("Nickname already taken"),
    });
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nickname/i), "takenname");
    await user.type(screen.getByLabelText(/email/i), "valid@example.com");
    await user.type(screen.getByLabelText(/password/i), "ValidPass1");
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Nickname already taken");
      expect(closeMock).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });
  });
});
