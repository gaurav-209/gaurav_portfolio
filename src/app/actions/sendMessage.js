"use server";

import { headers } from "next/headers";
import { site } from "@/data/site";
import { CONSENT_TEXT } from "@/data/contact";
import { getDb } from "@/lib/mongodb";

// Handles the contact form: saves the message as a lead in MongoDB and emails it to you through Resend.
// Either one is enough for the visitor to see "sent", so a message is never lost if one service is down.
//
// Setup (server environment, e.g. .env.local or the host's env settings):
//   MONGODB_URI     for saving    connection string from MongoDB Atlas (see src/lib/mongodb.js)
//   RESEND_API_KEY  for emailing  API key from resend.com → API Keys
//   CONTACT_TO      optional      where emails go (default: site.email)
//   CONTACT_FROM    optional      sender, e.g. "Portfolio <hello@gauravmahavar.in>" once your domain is
//                                 verified in Resend. Until then the default test sender only delivers to
//                                 the email address your Resend account was created with.
//
// Leads are stored in the "leads" collection, one document per message:
//   { name, email, topic, message, consent: { text, at, atIST }, status: "new", notes: [], source,
//     createdAt, createdAtIST, updatedAt }   (dates are UTC; the *IST fields are the same time in India)
// `status` and `notes` are there for managing clients later (e.g. "new" → "contacted" → "won" / "lost").
//
// Server functions can be called by anyone with a POST request, so everything is re-checked here.

const TOPICS = ["a website", "a web app", "a desktop app", "something else"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ponytail: in-memory limit per IP, resets on restart and isn't shared between server instances;
// move to a store like Upstash/Redis if spam ever gets through.
const recent = new Map();
const LIMIT = 3; // messages
const WINDOW = 10 * 60 * 1000; // per 10 minutes

function tooMany(ip) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > LIMIT;
}

// "26 Nov 2026, 3:45 pm IST". MongoDB always stores dates in UTC, so leads also keep this readable India time.
const ist = (date) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }).format(date) + " IST";

// The consent record added to every email: who agreed, when (India time), and the exact wording they ticked.
function consentRecord(email, at) {
  return `Consent: given by ${email} on ${ist(at)}, by ticking:\n"${CONSENT_TEXT}"`;
}

async function saveLead(lead) {
  const db = await getDb()?.catch((err) => (console.error("sendMessage: MongoDB connection failed", err.message), null));
  if (!db) return false;
  try {
    await db.collection("leads").insertOne({ ...lead, status: "new", notes: [], source: "portfolio-contact-form", updatedAt: lead.createdAt });
    return true;
  } catch (err) {
    console.error("sendMessage: saving the lead failed", err.message);
    return false;
  }
}

async function emailLead({ name, email, topic, message, createdAt }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO || site.email],
      reply_to: email, // hit Reply in your inbox to answer them directly
      subject: `Portfolio: ${topic} – ${name}`,
      // Plain text only, so nothing a visitor types can be rendered as HTML in your inbox.
      text: `${message}\n\n— ${name} (${email})\nTopic: ${topic}\n\n${consentRecord(email, createdAt)}\n\nSent from the contact form on ${site.name}'s portfolio.`,
    }),
  }).catch((err) => ({ ok: false, status: 0, text: async () => String(err) }));
  if (!res.ok) console.error("sendMessage: Resend failed", res.status, await res.text());
  return res.ok;
}

export async function sendMessage(input) {
  const name = String(input?.name ?? "").trim();
  const email = String(input?.email ?? "").trim();
  const topic = String(input?.topic ?? "");
  const message = String(input?.message ?? "").trim();

  // Bots fill every field, including this one that people never see.
  if (input?.website) return { ok: true };

  if (!name || name.length > 100) return { ok: false, error: "Please add your name." };
  if (!EMAIL.test(email) || email.length > 254) return { ok: false, error: "Please add a valid email." };
  if (!TOPICS.includes(topic)) return { ok: false, error: "Please pick a topic." };
  if (message.length < 10 || message.length > 5000) return { ok: false, error: "Please write 10 to 5,000 characters." };
  if (input?.consent !== true) return { ok: false, error: "Please tick the consent box." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (tooMany(ip)) return { ok: false, error: "Too many messages. Please try again in a few minutes, or email me directly." };

  const createdAt = new Date();
  const lead = {
    name,
    email,
    topic,
    message,
    consent: { text: CONSENT_TEXT, at: createdAt, atIST: ist(createdAt) },
    createdAt, // real date (UTC) for sorting and filtering
    createdAtIST: ist(createdAt), // the same moment, readable in India time
  };
  const [saved, emailed] = await Promise.all([saveLead(lead), emailLead(lead)]);
  if (saved || emailed) return { ok: true };

  if (!process.env.MONGODB_URI && !process.env.RESEND_API_KEY) {
    console.error("sendMessage: neither MONGODB_URI nor RESEND_API_KEY is set");
    return { ok: false, error: "The form isn't set up yet. Please email me directly." };
  }
  return { ok: false, error: "Something went wrong sending your message. Please email me directly." };
}
