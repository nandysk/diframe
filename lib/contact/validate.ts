// Shared by the form and the server action. Keep this file free of server-only code.

// Order matches the division numbering, with "unsure" as the default choice.
export const TOPICS = ["software", "ai", "data", "infrastructure", "security", "design", "unsure"] as const;
export type Topic = (typeof TOPICS)[number];
export const DEFAULT_TOPIC: Topic = "unsure";

export function isTopic(value: string): value is Topic {
  return (TOPICS as readonly string[]).includes(value);
}

/** The contact page address's topic value for a division, by its index. */
export function divisionTopic(index: number): Topic {
  return TOPICS[index] ?? DEFAULT_TOPIC;
}

export const LIMITS = { name: 120, email: 254, organization: 160, messageMin: 10, messageMax: 5000 } as const;

export type ContactValues = {
  name: string;
  email: string;
  organization: string;
  topic: Topic;
  message: string;
};

export type FieldError = "required" | "tooLong" | "invalidEmail" | "tooShort";
export type FieldErrors = Partial<Record<"name" | "email" | "organization" | "message", FieldError>>;

export type ContactState =
  | { status: "idle"; values?: ContactValues }
  | { status: "invalid"; values: ContactValues; errors: FieldErrors }
  | { status: "sent"; email: string }
  | { status: "tooFast" | "rateLimited" | "failed"; values: ContactValues };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Line breaks are removed from single-line fields so they can't alter email headers.
const singleLine = (value: FormDataEntryValue | null) =>
  (typeof value === "string" ? value : "").replace(/[\r\n\t]+/g, " ").trim();

export function readValues(form: FormData): ContactValues {
  const topic = singleLine(form.get("topic"));
  const message = form.get("message");
  return {
    name: singleLine(form.get("name")),
    email: singleLine(form.get("email")),
    organization: singleLine(form.get("organization")),
    topic: isTopic(topic) ? topic : DEFAULT_TOPIC,
    message: (typeof message === "string" ? message : "").trim(),
  };
}

export function validate(values: ContactValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name) errors.name = "required";
  else if (values.name.length > LIMITS.name) errors.name = "tooLong";

  if (!values.email) errors.email = "required";
  else if (values.email.length > LIMITS.email) errors.email = "tooLong";
  else if (!EMAIL.test(values.email)) errors.email = "invalidEmail";

  if (values.organization.length > LIMITS.organization) errors.organization = "tooLong";

  if (!values.message) errors.message = "required";
  else if (values.message.length < LIMITS.messageMin) errors.message = "tooShort";
  else if (values.message.length > LIMITS.messageMax) errors.message = "tooLong";

  return errors;
}
