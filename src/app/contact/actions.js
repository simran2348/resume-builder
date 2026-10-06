"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { SITE } from "@/constants/site";

// Contact form → email, sent with Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email).
// Configure in .env.local (and on your host):
//   RESEND_API_KEY      API key from resend.com
//   CONTACT_TO_EMAIL    inbox that receives the messages
//   CONTACT_FROM_EMAIL  optional sender; defaults to Resend's test sender, which can only deliver to the
//                       email address of your Resend account. Use an address on a verified domain otherwise.
const DEFAULT_FROM = `${SITE.name} <onboarding@resend.dev>`;

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Please keep your name under 100 characters."),
  email: z.email("Please enter a valid email address.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(5000, "Please keep your message under 5,000 characters."),
});

// Basic per-IP throttle (per server instance) to slow down spam.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recentByIp = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (recentByIp.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  recentByIp.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function sendContactMessage(prevState, formData) {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real visitors never see or fill this field. Pretend it worked so bots don't retry.
  if (formData.get("company")) return { status: "success" };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return { status: "error", message: "You've sent several messages recently. Please try again later." };
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error("Contact form: RESEND_API_KEY and CONTACT_TO_EMAIL must be set.");
    return { status: "error", message: "Sorry, the contact form isn't available right now." };
  }

  const { name, email, message } = parsed.data;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `${SITE.name} contact: ${name.replace(/[\r\n]+/g, " ")}`,
        // Plain text only, so nothing the visitor types is rendered as HTML.
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  } catch (err) {
    console.error("Contact form: sending failed.", err);
    return { status: "error", message: "Sorry, your message couldn't be sent. Please try again in a moment." };
  }

  return { status: "success" };
}
