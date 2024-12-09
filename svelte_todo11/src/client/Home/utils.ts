import type { ZodError } from 'zod';

export function formatZodError(error: ZodError): string {
  return error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n');
}