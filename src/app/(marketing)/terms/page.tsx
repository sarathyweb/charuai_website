import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service - Charu AI",
  description: "Terms of service for using Charu AI.",
};

export default function TermsOfService() {
  return (
    <article className="max-w-[680px] mx-auto px-6 py-12 md:py-20">
      <h1 className="font-serif text-primary text-3xl md:text-4xl">
        Terms of Service
      </h1>
      <p className="text-sm tracking-[0.01em] text-muted mb-10">Last updated: April 7, 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            What Charu is
          </h2>
          <p className="text-base leading-relaxed">
            AI accountability assistant. Calls your phone, chats on WhatsApp,
            connects to Google Calendar and Gmail. Not a therapist, life coach,
            or medical professional.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            Who can use Charu
          </h2>
          <p className="text-base leading-relaxed">
            18+, valid WhatsApp account. Phone number is your account, one
            number one account.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            What you agree to
          </h2>
          <p className="text-base leading-relaxed">
            Use for intended purpose. No abuse, no automated access, no reverse
            engineering.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            Google integration
          </h2>
          <p className="text-base leading-relaxed">
            Only accessed with explicit consent. Revoke anytime.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            WhatsApp and Twilio
          </h2>
          <p className="text-base leading-relaxed">
            Charu depends on them. If they go down, Charu goes down. Not
            responsible for their outages.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            AI-generated content
          </h2>
          <p className="text-base leading-relaxed">
            Charu is AI. Responses may not be perfect. Not a substitute for
            professional advice.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            What we are not responsible for
          </h2>
          <p className="text-base leading-relaxed">
            Provided as-is. No guarantees on productivity outcomes.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            Stopping or leaving
          </h2>
          <p className="text-base leading-relaxed">
            Stop anytime by messaging &quot;stop.&quot; We can terminate for abuse.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            Changes to these terms
          </h2>
          <p className="text-base leading-relaxed">
            Notified via WhatsApp. Continued use means acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-primary text-xl mb-3">
            Governing law
          </h2>
          <p className="text-base leading-relaxed">
            Governed by the laws of India.
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
