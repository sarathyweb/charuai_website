import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { AuthProvider, useAuth } from "@/lib/auth";

const mocks = vi.hoisted(() => ({
  signOut: vi.fn(),
  signInWithPhoneNumber: vi.fn(),
  confirm: vi.fn(),
  getIdToken: vi.fn(),
  authStateCallback: null as null | ((user: unknown) => void),
}));

vi.mock("@/lib/firebase", () => ({
  auth: {
    signOut: mocks.signOut,
  },
}));

vi.mock("firebase/auth", () => ({
  RecaptchaVerifier: vi.fn(),
  signInWithPhoneNumber: mocks.signInWithPhoneNumber,
  onAuthStateChanged: vi.fn((_auth, callback) => {
    mocks.authStateCallback = callback;
    callback(null);
    return vi.fn();
  }),
}));

function Harness() {
  const { sendOtp, verifyOtp } = useAuth();

  return (
    <>
      <button type="button" onClick={() => sendOtp("+15551234567")}>
        Send OTP
      </button>
      <button
        type="button"
        onClick={async () => {
          try {
            await verifyOtp("123456");
          } catch (error) {
            document.body.dataset.authError = (error as Error).message;
          }
        }}
      >
        Verify OTP
      </button>
    </>
  );
}

function StatusHarness() {
  const { user, loading } = useAuth();

  return (
    <div data-testid="auth-status">
      {loading ? "loading" : user ? `signed-in:${user.uid}` : "signed-out"}
    </div>
  );
}

beforeEach(() => {
  mocks.signOut.mockReset();
  mocks.signInWithPhoneNumber.mockReset();
  mocks.confirm.mockReset();
  mocks.getIdToken.mockReset();
  mocks.authStateCallback = null;
  vi.stubGlobal("fetch", vi.fn());
  delete document.body.dataset.authError;

  mocks.getIdToken.mockResolvedValue("jwt-token");
  mocks.confirm.mockResolvedValue({
    user: { uid: "firebase-user", getIdToken: mocks.getIdToken },
  });
  mocks.signInWithPhoneNumber.mockResolvedValue({
    confirm: mocks.confirm,
  });
});

describe("AuthProvider", () => {
  test("signs out and fails verification when backend sync fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("{}", { status: 500 }));

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Send OTP" }));
    await waitFor(() => expect(mocks.signInWithPhoneNumber).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Verify OTP" }));

    await waitFor(() => expect(mocks.signOut).toHaveBeenCalledOnce());
    expect(document.body.dataset.authError).toBe(
      "Could not finish sign-in. Please try again.",
    );
  });

  test("signs out and fails verification when backend sync rejects", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("offline"));

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Send OTP" }));
    await waitFor(() => expect(mocks.signInWithPhoneNumber).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Verify OTP" }));

    await waitFor(() => expect(mocks.signOut).toHaveBeenCalledOnce());
    expect(document.body.dataset.authError).toBe(
      "Could not finish sign-in. Please try again.",
    );
  });

  test("does not expose Firebase user before backend sync completes", async () => {
    let resolveSync: (response: Response) => void = () => {};
    vi.mocked(fetch).mockReturnValueOnce(
      new Promise<Response>((resolve) => {
        resolveSync = resolve;
      }),
    );

    render(
      <AuthProvider>
        <StatusHarness />
      </AuthProvider>,
    );

    act(() => {
      mocks.authStateCallback?.({
        uid: "firebase-user",
        getIdToken: mocks.getIdToken,
      });
    });

    expect(screen.getByTestId("auth-status").textContent).toBe("loading");
    expect(screen.getByTestId("auth-status").textContent).not.toContain("signed-in");

    resolveSync(new Response("{}", { status: 200 }));

    await waitFor(() =>
      expect(screen.getByTestId("auth-status").textContent).toBe(
        "signed-in:firebase-user",
      ),
    );
  });
});
