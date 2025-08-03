import { FC } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

type InputFileProps = {
  name: string;
  accept?: string;
};

const InputFile: FC<InputFileProps> = ({ name, accept }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange } }) => (
        <input
          type="file"
          accept={accept}
          multiple={false}
          onChange={(e) => {
            const files = e.target.files;
            if (!files) return;
            onChange(files[0]);
          }}
        />
      )}
    />
  );
};

export default InputFile;
