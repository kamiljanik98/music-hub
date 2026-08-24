import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Provider } from "@supabase/supabase-js";

interface SocialButtonProps {
  provider: Provider;
  onClick: () => void;
  disabled?: boolean;
}

const providerLabels: Partial<Record<Provider, string>> = {
  discord: "Discord",
};

const SocialButton = ({ provider, onClick, disabled }: SocialButtonProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      className="flex gap-2.5 p-6"
      onClick={onClick}
      disabled={disabled}
    >
      <Image src={`/${provider}.svg`} alt="" width={20} height={20} />
      Continue with {providerLabels[provider] ?? provider}
    </Button>
  );
};

export default SocialButton;
