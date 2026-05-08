export type FormErrors<T extends string = string> = Partial<Record<T, string>>;

export interface FormSubmission {
  name: string;
  email: string;
  phone: string;
  branch?: string;
  year?: string;
  section?: string;
  [key: string]: string | string[] | undefined;
}

export type ValidationResult<T extends string = string> = {
  ok: boolean;
  errors: FormErrors<T>;
};
