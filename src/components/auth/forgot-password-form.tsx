"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/lib/validations/auth";
import useForgotPassword from "@/hooks/auth/use-forgot-password";
import FormInput from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { authErrorMessage } from "@/lib/auth-error-message";

const ForgotPasswordForm = () => {
  const { resetPassword, isLoading, success } = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    const { error } = await resetPassword(values.email);

    if (error) {
      toast.error(authErrorMessage(error));
      return;
    }

    toast.success("Check your inbox - we sent you a reset link.");
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
        disabled={success}
      />
      <Button
        className="text-sm bg-neutral-800 h-12"
        type="submit"
        disabled={isLoading || success}
      >
        {success ? "Link sent" : "Send reset link"}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
