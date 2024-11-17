'use client';

import { z, ZodError, ZodIssueCode } from 'zod';
import { ChangeEvent, FormEvent, SetStateAction, useState } from 'react';
import { CONSTANTS } from '@/constants';
import { useLogger } from 'next-axiom';

export default function useForm<T extends z.ZodObject<any, any, any>>(schema: T, initialValues: z.infer<T>) {
  const log = useLogger();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<{ [key in keyof typeof initialValues]?: string | null }>({});

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setValues((prevValues) => ({ ...prevValues, [name]: value }));

    if (errors[name]) {
      // Validate on change to remove errors as soon as valid data is entered
      if ('password' in values && 'confirmPassword' in values) {
        if (
          (name === 'confirmPassword' && value === values.password) ||
          (name === 'password' && value === values.confirmPassword)
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: null,
            confirmPassword: null,
          }));
        }
      }

      try {
        schema.shape[name].parse(value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
      } catch (error) {
        if (error instanceof ZodError) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error.errors[0]?.message || null,
          }));
        }
      }
    }
  }

  function checkPasswordsMatch() {
    if ('password' in values && 'confirmPassword' in values) {
      if (values.password !== values.confirmPassword) {
        const customZodError = new ZodError([]);

        customZodError.addIssue({
          code: ZodIssueCode.custom,
          path: ['password'],
          message: 'Passwords do not match',
        });

        customZodError.addIssue({
          code: ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: 'Passwords do not match',
        });

        throw customZodError;
      }
    }
  }

  function validate() {
    // Validate on submit
    try {
      schema.parse(values);
      checkPasswordsMatch();
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof typeof initialValues, string | null>> = {};

        error.errors.forEach((err) => {
          newErrors[err.path[0] as keyof typeof initialValues] = err.message;
        });

        log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, {
          error: newErrors,
        });

        setErrors(newErrors as SetStateAction<typeof errors>);
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
