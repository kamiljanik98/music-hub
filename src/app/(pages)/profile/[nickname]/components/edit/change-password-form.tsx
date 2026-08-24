"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from "@/lib/validations/auth";
import useChangePassword from "@/hooks/profile/use-change-password";
import FormInput from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { authErrorMessage } from "@/lib/auth-error-message";

export function ChangePasswordForm() {
  const router = useRouter();
  const { change, isLoading } = useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
    mode: "onBlur",
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    const { error } = await change(values.currentPassword, values.newPassword);

    if (error) {
      toast.error(authErrorMessage(error));
      return;
    }

    toast.success("Password updated.");
    form.reset();
    router.refresh();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <FormInput
        name="currentPassword"
        control={form.control}
        label="Current password"
        type="password"
        placeholder="******"
      />
      <FormInput
        name="newPassword"
        control={form.control}
        label="New password"
        type="password"
        placeholder="******"
      />
      <Button type="submit" loading={isLoading}>
        Update password
      </Button>
    </form>
  );
}
