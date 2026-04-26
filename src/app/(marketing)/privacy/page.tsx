import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy - Charu AI",
  description: "How Charu AI handles your data.",
};

export default function PrivacyPolicy() {
  return (
    <article className="max-w-[680px] mx-auto px-6 py-12 md:py-20">
      <h1 className="font-serif text-primary text-3xl md:text-4xl">
        Privacy Policy
      </h1>
      <p className="text-sm tracking-[0.01em] text-muted mb-10">Last updated: April 7, 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            What data we collect
          </h2>
          <p className="text-base leading-relaxed">
            Phone number, name, timezone. If you connect Google Calendar or
            Gmail, encrypted OAuth tokens.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            How we use your data
          </h2>
          <p className="text-base leading-relaxed">
            Accountability calls, task tracking, calendar integration, email
            management. We don&apos;t sell your data or use it for advertising.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            WhatsApp and Twilio
          </h2>
          <p className="text-base leading-relaxed">
            Twilio routes messages and calls. Twilio doesn&apos;t store message
            content beyond delivery. See the{" "}
            <a
              href="https://www.twilio.com/en-us/legal/privacy"
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twilio privacy policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            Google integration
          </h2>
          <p className="text-base leading-relaxed">
            Calendar read/write, Gmail read/send. Only with explicit consent.
            Revoke anytime via Google account settings or by asking Charu.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            Data storage and security
          </h2>
          <p className="text-base leading-relaxed">
            PostgreSQL on Google Cloud. OAuth tokens encrypted at rest with
            Fernet. No plain-text credentials.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            Data retention
          </h2>
          <p className="text-base leading-relaxed">
            Data kept while account active. Deleted within 30 days of account
            deletion. Delete by messaging &quot;delete my account&quot; or emailing{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">Your rights</h2>
          <p className="text-base leading-relaxed">
            Export or delete data anytime. Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline"
            >
              {CONTACT_EMAIL}
            </a>
            , respond within 7 days.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            Third-party services
          </h2>
          <p className="text-base leading-relaxed">
            Google Cloud, Twilio, Vertex AI. Each has its own privacy policy.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            Changes to this policy
          </h2>
          <p className="text-base leading-relaxed">
            Notified via WhatsApp. Continued use means acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">Contact</h2>
          <p className="text-base leading-relaxed">
            Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
