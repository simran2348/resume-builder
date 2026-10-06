"use client";

import { cloneElement, useActionState, useState } from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck, Loader2, Send } from "lucide-react";

import { sendContactMessage } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const FIELD_CLASS = "h-11 rounded-xl px-3.5 text-base md:text-base";

const EMPTY = { name: "", email: "", message: "" };

// Uses only divs / spans for text: ContentPage styles plain <p>, <a> and lists inside the card.
// Fields are controlled so what the visitor typed survives a failed send (and Base UI's Input never sees
// its default value change).
export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, { status: "idle" });
  const [values, setValues] = useState(EMPTY);
  // The success state that the visitor dismissed with "Send another message".
  const [dismissed, setDismissed] = useState(null);
  const bind = (field) => ({
    value: values[field],
    onChange: (e) => setValues((current) => ({ ...current, [field]: e.target.value })),
  });

  if (state.status === "success" && state !== dismissed) {
    return (
      <div role="status" className="rounded-2xl border border-brand/20 bg-brand-soft px-6 py-8 text-center">
        <CircleCheck className="mx-auto size-10 text-brand" aria-hidden />
        <div className="mt-3 text-lg font-semibold text-heading">Thanks, your message has been sent.</div>
        <div className="mt-1 text-sm text-muted-foreground">We&apos;ll reply to the email address you gave us.</div>
        <Button
          variant="outline"
          onClick={() => {
            setDismissed(state);
            setValues(EMPTY);
          }}
          className="mt-5 h-10 rounded-xl px-4"
        >
          Send another message
        </Button>
      </div>
    );
  }

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label="Name" error={errors.name?.[0]}>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            {...bind("name")}
            className={FIELD_CLASS}
          />
        </Field>
        <Field id="contact-email" label="Email" error={errors.email?.[0]}>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            {...bind("email")}
            className={FIELD_CLASS}
          />
        </Field>
      </div>

      <Field id="contact-message" label="Message" error={errors.message?.[0]}>
        <Textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          {...bind("message")}
          placeholder="How can we help?"
          className="min-h-36 rounded-xl px-3.5 py-3 text-base md:text-base"
        />
      </Field>

      {/* Honeypot for bots: hidden from people and assistive technology. */}
      <div aria-hidden className="absolute -left-[10000px] size-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-muted-foreground">
          We only use these details to reply to you. See our <Link href="/privacy">Privacy Policy</Link>.
        </span>
        <Button
          type="submit"
          disabled={pending}
          className="h-11 gap-2 rounded-xl bg-brand px-5 text-base text-brand-foreground hover:bg-brand/90 focus-visible:ring-brand/40"
        >
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
          {pending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

function Field({ id, label, error, children }) {
  const errorId = `${id}-error`;
  // Wire the error message to the control for screen readers.
  const control = cloneElement(children, {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  });

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-heading">
        {label}
      </Label>
      {control}
      {error && (
        <span id={errorId} className="block text-sm text-destructive">
          {error}
        </span>
      )}
    </div>
  );
}
