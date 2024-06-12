import { ZodError } from 'zod';

export function constructZodErrorMessage(error: ZodError) {
  let errorMessage = '';

  error.issues.forEach((issue) => {
    errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '. ';
  });

  return errorMessage;
}
