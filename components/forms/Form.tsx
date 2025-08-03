import { FC } from 'react';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';

type FormProps = {
  children: React.ReactNode;
  onSubmit: SubmitHandler<unknown>;
};

const Form: FC<FormProps> = ({ children, onSubmit }) => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default Form;
