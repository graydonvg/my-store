'use client';

import { z, ZodError, ZodIssueCode, ZodObject } from 'zod';
import { ChangeEvent, FormEvent, SetStateAction, useState } from 'react';
import { useLogger } from 'next-axiom';

export default function useForm<T extends ZodObject<any, any, any>>(
  schema: T,
  initialValues: z.infer<T>,
  options?: {
    checkEquality?: Array<{ fields: [keyof z.infer<T>, keyof z.infer<T>]; message: string }>;
  }
) {
  const log = useLogger();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<{ [key in keyof typeof initialValues]?: string | null }>({});

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setValues((prevValues) => ({ ...prevValues, [name]: value }));

    if (errors[name]) {
      // Validate on change to remove errors as soon as valid data is entered
      if (options?.checkEquality) {
        options.checkEquality.forEach(({ fields, message }) => {
          const [field1, field2] = fields;

          // If the updated field is part of the equality check
          if (field1 === name || field2 === name) {
            if (value === values[field1] || value === values[field2]) {
              // Clear errors if the values are now equal
              setErrors((prevErrors) => ({
                ...prevErrors,
                [field1]: null,
                [field2]: null,
              }));
            } else {
              // Set errors if values are still unequal
              setErrors((prevErrors) => ({
                ...prevErrors,
                [field1]: message,
                [field2]: message,
              }));
            }
          }
        });
      }

      try {
        schema.shape[name].parse(value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
      } catch (error) {
        if (error instanceof ZodError) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error.errors[0].message,
          }));
        }
      }
    }
  }

  function checkEquality() {
    if (options?.checkEquality) {
      options.checkEquality.forEach(({ fields, message }) => {
        const [field1, field2] = fields;
        if (values[field1] !== values[field2]) {
          const customError = new ZodError([]);

          customError.addIssue({
            code: ZodIssueCode.custom,
            path: [field1 as string],
            message,
          });

          customError.addIssue({
            code: ZodIssueCode.custom,
            path: [field2 as string],
            message,
          });

          throw customError;
        }
      });
    }
  }

  function validate() {
    // Validate on submit
    try {
      schema.parse(values);
      checkEquality();
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof typeof initialValues, string | null>> = {};

        error.errors.forEach((err) => {
          newErrors[err.path[0] as keyof typeof initialValues] = err.message;
        });

        setErrors(newErrors as SetStateAction<typeof errors>);
      } else {
        log.error('An unexpected error occured during form validation', { error });
      }

      return false;
    }
  }

  function handleSubmit(submitCallback: () => void) {
    return function (e: FormEvent) {
      e.preventDefault();

      if (validate()) {
        submitCallback();
      }
    };
  }

  function reset() {
    setValues(initialValues);
  }

  return { values, errors, handleChange, handleSubmit, reset };
}
