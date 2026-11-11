"use client";

import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Turnstile } from "@/components/pages/turnstile";
import type { Dictionary } from "@/content";
import { sendContact } from "@/lib/contact/action";
import { DEFAULT_TOPIC, LIMITS, TOPICS, isTopic, type ContactState, type FieldError, type Topic } from "@/lib/contact/validate";
import { pagePath, type Locale } from "@/lib/i18n/routes";

const INITIAL: ContactState = { status: "idle" };

// Each division keeps its color here. "Not sure yet" has no division, so it stays neutral.
const hueOf = (topic: Topic, index: number) => (topic === "unsure" ? "var(--fg)" : `var(--d${index + 1})`);

// Division pages link here with ?topic=, which preselects that division.
function TopicFromAddress() {
  const topic = useSearchParams().get("topic");
  useEffect(() => {
    if (topic && isTopic(topic)) {
      const radio = document.getElementById(`topic-${topic}`);
      if (radio instanceof HTMLInputElement) radio.checked = true;
    }
  }, [topic]);
  return null;
}

function FieldMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-[0.9375rem] font-medium text-[color:var(--danger)]">
      <WarningCircleIcon aria-hidden="true" size={18} className="mt-[3px] shrink-0" />
      {message}
    </p>
  );
}

export function ContactForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { form } = dict.contact;
  const [state, action, pending] = useActionState(sendContact, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);
  const noticeRef = useRef<HTMLParagraphElement>(null);
  const sentRef = useRef<HTMLHeadingElement>(null);
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  // After each answer, focus moves to what the visitor needs to read or fix next.
  useEffect(() => {
    if (state.status === "sent") sentRef.current?.focus();
    else if (state.status === "invalid") formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    else if (state.status !== "idle") noticeRef.current?.focus();
  }, [state]);

  if (state.status === "sent") {
    return (
      <div className="animate-in fade-in-0 duration-300">
        <CheckCircleIcon aria-hidden="true" size={40} weight="duotone" className="text-[color:var(--d1)]" />
        <h2 ref={sentRef} tabIndex={-1} className="mt-5 text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.03em] outline-none">
          {form.sentTitle}
        </h2>
        <p className="type-lead mt-4 max-w-[40ch] text-muted-foreground">
          {form.sentText.replace("{email}", state.email)}
        </p>
        <Link href={pagePath(lang, "projects")} className="text-link mt-4">
          {form.sentLink}
        </Link>
      </div>
    );
  }

  const values = "values" in state ? state.values : undefined;
  const errors = state.status === "invalid" ? state.errors : {};
  const notice = state.status === "tooFast" || state.status === "rateLimited" || state.status === "notVerified" || state.status === "failed" ? form[state.status].replace("{email}", dict.contact.email) : null;
  const errorText = (field: keyof typeof form.errors, code?: FieldError) =>
    code ? (form.errors[field] as Partial<Record<FieldError, string>>)[code] : undefined;
  const describe = (field: string, hasError: boolean, hint = false) =>
    [hint ? `${field}-hint` : "", hasError ? `${field}-error` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      onSubmit={(event) => {
        const elapsed = event.currentTarget.elements.namedItem("elapsed");
        if (elapsed instanceof HTMLInputElement) elapsed.value = String(Date.now() - openedAt.current);
      }}
      className="grid gap-6"
    >
      <Suspense fallback={null}>
        <TopicFromAddress />
      </Suspense>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="elapsed" defaultValue="" />
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="hp_field">{form.honeypot}</label>
        <input id="hp_field" name="hp_field" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">{form.name}</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={LIMITS.name}
            defaultValue={values?.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describe("name", Boolean(errors.name))}
            className="mt-2"
          />
          <FieldMessage id="name-error" message={errorText("name", errors.name)} />
        </div>
        <div>
          <Label htmlFor="email">{form.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={LIMITS.email}
            defaultValue={values?.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describe("email", Boolean(errors.email))}
            className="mt-2"
          />
          <FieldMessage id="email-error" message={errorText("email", errors.email)} />
        </div>
      </div>

      <div>
        <Label htmlFor="organization">{form.organization}</Label>
        <Input
          id="organization"
          name="organization"
          type="text"
          autoComplete="organization"
          maxLength={LIMITS.organization}
          defaultValue={values?.organization}
          aria-invalid={errors.organization ? true : undefined}
          aria-describedby={describe("organization", Boolean(errors.organization))}
          className="mt-2"
        />
        <FieldMessage id="organization-error" message={errorText("organization", errors.organization)} />
      </div>

      <fieldset>
        <legend className="text-[0.9375rem] font-medium">{form.topic}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((topic, index) => (
            <label key={topic} className="topic-choice" style={{ "--hue": hueOf(topic, index) } as React.CSSProperties}>
              <input
                id={`topic-${topic}`}
                type="radio"
                name="topic"
                value={topic}
                defaultChecked={(values?.topic ?? DEFAULT_TOPIC) === topic}
                className="sr-only"
              />
              <span aria-hidden="true" className="topic-mark" />
              {topic === "unsure" ? form.unsure : dict.divisions.items[index].short}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="message">{form.message}</Label>
        <p id="message-hint" className="mt-1 text-[0.9375rem] text-muted-foreground">
          {form.messageHint}
        </p>
        <Textarea
          id="message"
          name="message"
          required
          maxLength={LIMITS.messageMax}
          defaultValue={values?.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describe("message", Boolean(errors.message), true)}
          className="mt-2"
        />
        <FieldMessage id="message-error" message={errorText("message", errors.message)} />
      </div>

      <Turnstile lang={lang} resetKey={state} />

      {notice && (
        <p ref={noticeRef} tabIndex={-1} role="alert" className="flex items-start gap-2 rounded-[14px] border border-[color:var(--danger)] p-4 font-medium outline-none">
          <WarningCircleIcon aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-[color:var(--danger)]" />
          {notice}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <p className="max-w-[34ch] text-[0.9375rem] text-muted-foreground">
          {form.notice}{" "}
          <Link href={pagePath(lang, "privacy")} className="underline underline-offset-4 hover:text-foreground">
            {form.noticeLink}
          </Link>
        </p>
        <Button type="submit" size="pill" disabled={pending} className="relative z-[1]">
          {pending ? form.sending : dict.closing.action}
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {pending ? form.sending : ""}
      </p>
    </form>
  );
}
