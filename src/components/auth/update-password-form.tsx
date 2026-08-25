"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdatePasswordFormValues,
  updatePasswordSchema,
} from "@/lib/validations/auth";
import useUpdatePassword from "@/hooks/auth/use-update-password";
import FormInput from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { authErrorMessage } from "@/lib/auth-error-message";

const UpdatePasswordForm = () => {
  const router = useRouter();
  const { updatePassword, isLoading } = useUpdatePassword();

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: "" },
    mode: "onBlur",
  });

  const onSubmit = async (values: UpdatePasswordFormValues) => {
    const { error } = await updatePassword(values.password);

    if (error) {
      toast.error(authErrorMessage(error));
      return;
    }

    toast.success("Password updated.");
    router.push("/");
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3 bg-neutral-900"
    >
      <FormInput
        name="password"
        control={form.control}
        label="New password"
        type="password"
        placeholder="******"
      />
      <Button
        className="text-sm bg-neutral-800 h-12"
        type="submit"
        loading={isLoading}
      >
        Update password
      </Button>
    </form>
  );
};

export default UpdatePasswordForm;
