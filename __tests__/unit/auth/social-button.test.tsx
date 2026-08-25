// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SocialButton from "@/components/auth/social-button";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}));

describe("SocialButton", () => {
  it("renders the provider icon as decorative", () => {
    const { container } = render(
      <SocialButton provider="discord" onClick={vi.fn()} />
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/social/discord.svg");
    expect(img).toHaveAttribute("alt", "");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("names the button with a visible label", () => {
    render(<SocialButton provider="discord" onClick={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Continue with Discord" })
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<SocialButton provider="discord" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<SocialButton provider="discord" onClick={vi.fn()} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is not disabled when disabled prop is true", () => {
    render(<SocialButton provider="discord" onClick={vi.fn()} />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });
});
