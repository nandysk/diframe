import "server-only";
import type { ContactValues, Topic } from "@/lib/contact/validate";

const TOPIC_NAMES: Record<Topic, string> = {
  software: "Software",
  ai: "AI & Automation",
  data: "Data & BI",
  infrastructure: "Infrastructure & Cloud",
  security: "Cybersecurity",
  design: "Design & Documents",
  unsure: "Not sure yet",
};

const API_URL = process.env.RESEND_API_URL || "https://api.resend.com/emails";

/** Delivers one request to Diframe's inbox. Returns false unless the provider accepted it. */
export async function sendContactEmail(values: ContactValues, lang: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!key || !to || !from) {
    console.error("Contact form: RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL must all be set.");
    return false;
  }

  const text = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Organization: ${values.organization || "Not provided"}`,
    `Topic: ${TOPIC_NAMES[values.topic]}`,
    `Language: ${lang === "fr" ? "French" : "English"}`,
    "",
    values.message,
  ].join("\n");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject: `Consultation request: ${TOPIC_NAMES[values.topic]} (${values.name})`,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    // Only the status is logged, so a visitor's details never reach the server logs.
    if (!response.ok) console.error(`Contact form: the email provider answered ${response.status}.`);
    return response.ok;
  } catch (error) {
    console.error(`Contact form: the email provider could not be reached (${error instanceof Error ? error.name : "unknown"}).`);
    return false;
  }
}
