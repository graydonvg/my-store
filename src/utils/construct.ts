import { ZodError } from 'zod';

export function constructZodErrorMessage(error: ZodError) {
  let errorMessage = '';

  error.issues.forEach((issue) => {
    errorMessage = errorMessage + issue.path[issue.path.length - 1] + ': ' + issue.message + '. ';
  });

  return errorMessage;
}
