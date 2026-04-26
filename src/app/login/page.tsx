"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { user, loading, sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState<string | undefined>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  const handleSendOtp = async () => {
    if (!phone) return;
    setSubmitting(true);
    setError("");
    try {
      await sendOtp(phone);
      setOtpSent(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to send code";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setSubmitting(true);
    setError("");
    try {
      await verifyOtp(code);
      router.replace("/dashboard");
    } catch {
      setError("Invalid code. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="bg-surface border border-warm-gray/30 rounded-2xl shadow-card w-full max-w-[400px] p-10">
          <div className="text-center mb-8">
            <Image
              src="/logo.svg"
              alt="Charu AI"
              width={145}
              height={32}
              className="h-8 w-auto mx-auto"
              priority
            />
          </div>

          {!otpSent ? (
            <>
              <h1 className="text-[22px] font-bold text-dark text-center mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-muted text-center mb-8">
                Sign in with your phone number to access your dashboard.
              </p>

              <label className="block text-[13px] font-medium text-dark mb-1.5">
                Phone number
              </label>
              <PhoneInput
                international
                defaultCountry="IN"
                value={phone}
                onChange={setPhone}
                className="mb-6"
              />

              {error && (
                <p className="text-sm text-red-600 mb-4">{error}</p>
              )}

              <button
                onClick={handleSendOtp}
                disabled={!phone || submitting}
                className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-accent-warm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send verification code"}
              </button>

              <p className="text-xs text-muted text-center mt-6 leading-relaxed">
                By continuing, you agree to our{" "}
                <a href="/terms" className="text-primary underline">Terms</a> and{" "}
                <a href="/privacy" className="text-primary underline">Privacy Policy</a>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => { setOtpSent(false); setError(""); setOtp(["","","","","",""]); }}
                className="text-[13px] text-muted hover:text-dark mb-6 inline-flex items-center gap-1"
              >
                &larr; Change number
              </button>

              <h1 className="text-[22px] font-bold text-dark text-center mb-2">
                Enter verification code
              </h1>
              <p className="text-sm text-muted text-center mb-8">
                We sent a 6-digit code to<br />
                <span className="font-semibold text-dark">{phone}</span>
              </p>

              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    aria-label={`Verification digit ${i + 1}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-[22px] font-semibold text-dark bg-background border border-warm-gray rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center mb-4">{error}</p>
              )}

              <button
                onClick={handleVerify}
                disabled={otp.join("").length !== 6 || submitting}
                className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-accent-warm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Verifying..." : "Verify"}
              </button>

              <p className="text-xs text-muted text-center mt-6">
                Code expires in 5 minutes
              </p>
            </>
          )}
        </div>
      </div>
      <div className="text-center py-4">
        <Link href="/" className="text-xs text-muted underline">
          Back to charuai.com
        </Link>
      </div>
    </div>
  );
}
