import { ZodError } from 'zod';

function convertCamelCaseToTitleCase(paragraph: string) {
  return paragraph.replace(
    /\b[a-z]+([A-Z][a-z]*)+\b/g, // Matches camelCase words
    (match) =>
      match
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert spaces between lowercase and uppercase letters
        .replace(/^./, (m) => m.toUpperCase()) // Capitalize the first letter
  );
}

function removeStringAndCapitalizeNext(input: string) {
  // If "String" is found at the start of the input, the replacement function will capitalize the first character of the word that follows "String" and removes "String" along with the space
  return input.replace(/^String\s+(\w)/, (_, firstChar) => firstChar.toUpperCase());
}

export function constructZodErrorMessage(error: ZodError) {
  let errorMessage = '';

  error.issues.forEach((issue) => {
    errorMessage =
      errorMessage + issue.path[issue.path.length - 1] + ': ' + removeStringAndCapitalizeNext(issue.message) + '. ';
  });

  return convertCamelCaseToTitleCase(errorMessage);
}
