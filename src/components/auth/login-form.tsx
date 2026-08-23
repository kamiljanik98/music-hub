"use client";

import { toast } from "sonner";
import useLogin from "@/hooks/auth/use-login";
import useAuthModal from "@/hooks/auth/use-auth-dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/lib/validations/auth";
import FormInput from "@/components/form/form-input";
import SocialButton from "./social-button";
import useDiscordLogin from "@/hooks/auth/use-discord-login";
import { authErrorMessage } from "@/lib/auth-error-message";

const LoginForm = () => {
  const { login, isLoading } = useLogin();
  const { close, setView } = useAuthModal();
  const { discordLogin, isSocialLoading } = useDiscordLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: LoginFormValues) => {
    const { error } = await login(values);

    if (error) {
      toast.error(authErrorMessage(error));
      return;
    }

    close();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3 bg-neutral-900"
    >
      <FormInput
        name="email"
        control={form.control}
        label="Email"
        type="email"
        placeholder="user@mail.com"
      />
      <FormInput
        name="password"
        control={form.control}
        label="Password"
        type="password"
        placeholder="******"
      />
      <Button
        type="button"
        variant="link"
        size="xs"
        onClick={() => setView("forgot-password")}
        className="self-end"
      >
        Forgot password?
      </Button>
      <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
        Sign in
      </Button>
      <SocialButton
        provider="discord"
        onClick={discordLogin}
        disabled={isSocialLoading}
      />
    </form>
  );
};

export default LoginForm;
