import { reactive } from 'vue';
import { ZodSchema, ZodError } from 'zod';

export function useValidation<T>(schema: ZodSchema<T>) {
  const errors = reactive<Record<keyof T, string>>({} as Record<keyof T, string>);

  const validate = (data: Partial<T>): boolean => {
    try {
      schema.parse(data);
      resetErrors();
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors = err.errors.reduce((acc, error) => {
          const key = error.path[0] as keyof T;
          acc[key] = error.message;
          return acc;
        }, {} as Record<keyof T, string>);
        Object.assign(errors, newErrors);
      }
      return false;
    }
  };

  const resetErrors = () => {
    for (const key in errors) {
      errors[key] = '';
    }
  };

  return { errors, validate, resetErrors };
}