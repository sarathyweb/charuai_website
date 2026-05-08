"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import {
  type User,
  type ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sendOtp: (phoneNumber: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<User>;
  getIdToken: () => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.charuai.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const syncedUidRef = useRef<string | null>(null);

  const signOutAndClear = async () => {
    syncedUidRef.current = null;
    setUser(null);
    try {
      await auth.signOut();
    } catch {
      // The UI should not keep an authenticated state just because sign-out failed.
    }
  };

  const syncUserToBackend = async (firebaseUser: User) => {
    const token = await firebaseUser.getIdToken();
    const syncResponse = await fetch(`${API_BASE}/api/auth/sync`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!syncResponse.ok) {
      throw new Error("Backend auth sync failed");
    }

    syncedUidRef.current = firebaseUser.uid;
  };

  useEffect(() => {
    let disposed = false;
    let syncGeneration = 0;

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      const generation = ++syncGeneration;

      if (!u) {
        syncedUidRef.current = null;
        setUser(null);
        setLoading(false);
        return;
      }

      if (syncedUidRef.current === u.uid) {
        setUser(u);
        setLoading(false);
        return;
      }

      setUser(null);
      setLoading(true);
      void (async () => {
        try {
          await syncUserToBackend(u);
          if (!disposed && generation === syncGeneration) {
            setUser(u);
          }
        } catch {
          await signOutAndClear();
        } finally {
          if (!disposed && generation === syncGeneration) {
            setLoading(false);
          }
        }
      })();
    });

    return () => {
      disposed = true;
      unsubscribe();
    };
  }, []);

  const sendOtp = async (phoneNumber: string) => {
    recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    const result = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaRef.current
    );
    setConfirmationResult(result);
  };

  const verifyOtp = async (code: string): Promise<User> => {
    if (!confirmationResult) {
      throw new Error("No confirmation result. Send OTP first.");
    }
    const result = await confirmationResult.confirm(code);

    try {
      await syncUserToBackend(result.user);
      setUser(result.user);
    } catch {
      await signOutAndClear();
      throw new Error("Could not finish sign-in. Please try again.");
    }

    return result.user;
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  };

  const logout = async () => {
    syncedUidRef.current = null;
    setUser(null);
    await auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, sendOtp, verifyOtp, getIdToken, logout }}
    >
      {children}
      <div id="recaptcha-container" />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
