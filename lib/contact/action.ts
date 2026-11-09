"use server";

import { headers } from "next/headers";
import { sendContactEmail } from "@/lib/contact/send";
import { readValues, validate, type ContactState } from "@/lib/contact/validate";

const MIN_ELAPSED_MS = 3_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Per server instance and cleared on restart: a brake on bursts, not a hard limit.
const attempts = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  for (const [key, times] of attempts) {
    if (times.every((time) => now - time >= WINDOW_MS)) attempts.delete(key);
  }
  const recent = attempts.get(ip) ?? [];
  if (recent.length >= MAX_PER_WINDOW) return true;
  attempts.set(ip, [...recent, now]);
  return false;
}

export async function sendContact(_previous: ContactState, form: FormData): Promise<ContactState> {
  const values = readValues(form);

  // Only automated visitors fill the hidden field. They see success, so they don't adapt.
  if (form.get("hp_field")) return { status: "sent", email: values.email };

  const errors = validate(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", values, errors };

  // A real person who is simply fast is told to resend, so no request is dropped silently.
  // Browsers without JavaScript don't send this value, and they are let through.
  const elapsed = Number(form.get("elapsed"));
  if (form.get("elapsed") && elapsed < MIN_ELAPSED_MS) return { status: "tooFast", values };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  if (isRateLimited(ip)) return { status: "rateLimited", values };

  const lang = form.get("lang") === "fr" ? "fr" : "en";
  const delivered = await sendContactEmail(values, lang);
  return delivered ? { status: "sent", email: values.email } : { status: "failed", values };
}
