import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import LoginPage from "@/app/login/page";
import IntegrationsPage from "@/app/(app)/integrations/page";
import { authFetch } from "@/lib/api";
import { navigateExternal } from "@/lib/navigation";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  sendOtp: vi.fn(),
  verifyOtp: vi.fn(),
  user: null as { phoneNumber?: string } | null,
  loading: false,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt} src={props.src} className={props.className} />
  ),
}));

vi.mock("react-phone-number-input", () => ({
  default: (props: {
    value?: string;
    onChange: (value: string) => void;
    className?: string;
  }) => (
    <input
      aria-label="Phone number"
      className={props.className}
      value={props.value || ""}
      onChange={(event) => props.onChange(event.target.value)}
    />
  ),
}));

vi.mock("react-phone-number-input/style.css", () => ({}));

vi.mock("@/lib/auth", () => ({
  useAuth: () => ({
    user: mocks.user,
    loading: mocks.loading,
    sendOtp: mocks.sendOtp,
    verifyOtp: mocks.verifyOtp,
  }),
}));

vi.mock("@/lib/api", () => ({
  authFetch: vi.fn(),
}));

vi.mock("@/lib/navigation", () => ({
  navigateExternal: vi.fn(),
}));

function json(data: unknown, status = 200): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

beforeEach(() => {
  mocks.replace.mockReset();
  mocks.sendOtp.mockReset();
  mocks.verifyOtp.mockReset();
  mocks.user = null;
  mocks.loading = false;
  vi.mocked(authFetch).mockReset();
  vi.mocked(navigateExternal).mockReset();
  vi.spyOn(window, "confirm").mockReturnValue(true);
  vi.spyOn(window, "alert").mockImplementation(() => undefined);
});

describe("LoginPage", () => {
  test("sends an OTP and advances to code entry", async () => {
    mocks.sendOtp.mockResolvedValueOnce(undefined);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "+15551234567" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send verification code" }));

    await waitFor(() =>
      expect(mocks.sendOtp).toHaveBeenCalledWith("+15551234567"),
    );
    expect(await screen.findByText("Enter verification code")).toBeDefined();
  });

  test("verifies an OTP and routes to the dashboard", async () => {
    mocks.sendOtp.mockResolvedValueOnce(undefined);
    mocks.verifyOtp.mockResolvedValueOnce({} as never);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "+15551234567" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send verification code" }));

    await screen.findByText("Enter verification code");
    for (let index = 0; index < 6; index += 1) {
      fireEvent.input(screen.getByLabelText(`Verification digit ${index + 1}`), {
        target: { value: String(index + 1) },
      });
    }
    await waitFor(() =>
      expect(
        (screen.getByRole("button", { name: "Verify" }) as HTMLButtonElement)
          .disabled,
      ).toBe(false),
    );
    fireEvent.click(screen.getByRole("button", { name: "Verify" }));

    await waitFor(() => expect(mocks.verifyOtp).toHaveBeenCalledWith("123456"));
    expect(mocks.replace).toHaveBeenCalledWith("/dashboard");
  });
});

describe("IntegrationsPage", () => {
  test("loads integrations and disconnects Gmail through the API", async () => {
    mocks.user = { phoneNumber: "+15551234567" };
    vi.mocked(authFetch).mockImplementation((path) => {
      if (path === "/api/integrations") {
        return json({
          integrations: [
            {
              service: "gmail",
              connected: true,
              email: "asha@example.com",
            },
            {
              service: "google_calendar",
              connected: false,
            },
          ],
        });
      }
      if (path === "/api/integrations/gmail/disconnect") return json({});
      return json({});
    });

    render(<IntegrationsPage />);

    expect(await screen.findByText("asha@example.com")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Disconnect" }));

    await waitFor(() =>
      expect(authFetch).toHaveBeenCalledWith(
        "/api/integrations/gmail/disconnect",
        { method: "DELETE" },
      ),
    );
  });

  test("starts the Google Calendar connection flow with authenticated fetch", async () => {
    vi.mocked(authFetch).mockImplementation((path) => {
      if (path === "/api/integrations") {
        return json({
          integrations: [
            { service: "google_calendar", connected: false },
            { service: "gmail", connected: false },
          ],
        });
      }
      if (path === "/api/integrations/google_calendar/connect?redirect=false") {
        return json({ url: "https://accounts.example/connect" });
      }
      return json({});
    });

    render(<IntegrationsPage />);

    expect(await screen.findByText("Google Calendar")).toBeDefined();
    fireEvent.click(screen.getAllByRole("button", { name: "Connect" })[0]);

    await waitFor(() =>
      expect(authFetch).toHaveBeenCalledWith(
        "/api/integrations/google_calendar/connect?redirect=false",
      ),
    );
    expect(navigateExternal).toHaveBeenCalledWith(
      "https://accounts.example/connect",
    );
  });
});
