import { FC } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

type InputTextProps = {
  name: string;
  placeholder: string;
};

const InputText: FC<InputTextProps> = ({ name, placeholder }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <input {...field} type="text" value={field.value} placeholder={placeholder} />
      )}
    />
  );
};

export default InputText;
