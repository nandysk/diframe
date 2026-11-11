import "server-only";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Asks Cloudflare whether the form's spam check passed. Without a secret key the check
 * is off and every request passes, so the form works before Turnstile is set up.
 */
export async function passesTurnstile(token: FormDataEntryValue | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip !== "unknown") body.set("remoteip", ip);

  try {
    const response = await fetch(VERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(8_000) });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    // If Cloudflare can't be reached, let the request through: the other checks still apply,
    // and losing a real client's message costs more than one spam email.
    console.error(`Contact form: the spam check could not be reached (${error instanceof Error ? error.name : "unknown"}).`);
    return true;
  }
}
