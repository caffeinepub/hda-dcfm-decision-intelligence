import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Czech Republic",
  "Denmark",
  "Egypt",
  "Ethiopia",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "Hungary",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Thailand",
  "Turkey",
  "UAE",
  "Uganda",
  "Ukraine",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Zimbabwe",
];

type SocialProvider = "google" | "facebook" | null;

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { actor } = useActor();
  // Steps: "choose" = pick social provider, "connect" = waiting for ICP auth, "profile" = fill form, "returning" = confirm returning user
  const [step, setStep] = useState<
    "choose" | "connect" | "profile" | "returning"
  >("choose");
  const [selectedProvider, setSelectedProvider] =
    useState<SocialProvider>(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingProfile, setExistingProfile] = useState<{
    name: string;
    email: string;
    country: string;
  } | null>(null);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Once authenticated, check if profile exists
  useEffect(() => {
    if (!isAuthenticated || !actor) return;
    actor
      .hasCompletedProfile()
      .then(async (done) => {
        if (done) {
          // Show returning user confirmation — never auto-skip
          try {
            const profileOpt = await actor.getUserProfile();
            let p: { name: string; email: string; country: string } | null =
              null;
            if (Array.isArray(profileOpt) && profileOpt.length > 0) {
              const raw = profileOpt[0] as Record<string, unknown>;
              p = {
                name: typeof raw.name === "string" ? raw.name : "",
                email: typeof raw.email === "string" ? raw.email : "",
                country: typeof raw.country === "string" ? raw.country : "",
              };
            } else if (
              profileOpt &&
              typeof profileOpt === "object" &&
              "__kind__" in (profileOpt as object)
            ) {
              const opt = profileOpt as {
                __kind__: string;
                value?: Record<string, unknown>;
              };
              if (opt.__kind__ === "Some" && opt.value) {
                p = {
                  name:
                    typeof opt.value.name === "string" ? opt.value.name : "",
                  email:
                    typeof opt.value.email === "string" ? opt.value.email : "",
                  country:
                    typeof opt.value.country === "string"
                      ? opt.value.country
                      : "",
                };
              }
            }
            setExistingProfile(p);
          } catch {
            setExistingProfile(null);
          }
          setStep("returning");
        } else {
          setStep("profile");
        }
      })
      .catch(() => setStep("profile"));
  }, [isAuthenticated, actor]);

  const handleProviderSelect = (provider: SocialProvider) => {
    setSelectedProvider(provider);
    setStep("connect");
  };

  const handleConnect = async () => {
    await login();
    // after login identity changes, useEffect above will handle routing
  };

  const handleSaveProfile = async () => {
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!country) {
      setError("Country is required.");
      return;
    }
    if (!phone.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (!actor) return;
    setSaving(true);
    setError("");
    try {
      await actor.saveUserProfile(name, country, phone, email);
      onSuccess();
    } catch (_e) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const providerLabel =
    selectedProvider === "google"
      ? "Google"
      : selectedProvider === "facebook"
        ? "Facebook"
        : "";
  const providerColor = selectedProvider === "google" ? "#DB4437" : "#1877F2";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.82)" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8"
        style={{
          backgroundColor: "#0D2B1A",
          border: "1px solid rgba(200,162,74,0.35)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/70 text-2xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        {/* STEP 1: Choose provider */}
        {step === "choose" && (
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(200,162,74,0.1)",
                border: "1px solid rgba(200,162,74,0.3)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="14" cy="9" r="5" stroke="#C8A24A" strokeWidth="2" />
                <path
                  d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10"
                  stroke="#C8A24A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Sign in to continue
            </h2>
            <p className="text-white/50 text-sm mb-8">
              Choose how you'd like to connect to your Decision Twin.
            </p>

            <div className="space-y-3">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleProviderSelect("google")}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#fff", color: "#333" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.8 7.2v6h7.7c4.5-4.1 7.4-10.3 7.4-17.2z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9H2.6v6.2C6.6 42.7 14.7 48 24 48z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.5 28.6A14.7 14.7 0 0 1 9.6 24c0-1.6.3-3.2.9-4.6v-6.2H2.6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.2z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.9-6.9C35.8 2.3 30.4 0 24 0 14.7 0 6.6 5.3 2.6 13.2l7.9 6.2C12.4 13.7 17.7 9.5 24 9.5z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleProviderSelect("facebook")}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#1877F2", color: "#fff" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="white"
                  aria-hidden="true"
                >
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
                Continue with Facebook
              </button>
            </div>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs">secured by</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <p className="text-white/25 text-xs">
              ICP Internet Identity — cryptographic, privacy-first
              authentication
            </p>
          </div>
        )}

        {/* STEP 2: Connect screen */}
        {step === "connect" && (
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{
                backgroundColor: `${providerColor}22`,
                border: `1px solid ${providerColor}55`,
              }}
            >
              {selectedProvider === "google" ? (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.8 7.2v6h7.7c4.5-4.1 7.4-10.3 7.4-17.2z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9H2.6v6.2C6.6 42.7 14.7 48 24 48z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.5 28.6A14.7 14.7 0 0 1 9.6 24c0-1.6.3-3.2.9-4.6v-6.2H2.6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.2z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.9-6.9C35.8 2.3 30.4 0 24 0 14.7 0 6.6 5.3 2.6 13.2l7.9 6.2C12.4 13.7 17.7 9.5 24 9.5z"
                  />
                </svg>
              ) : (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="#1877F2"
                  aria-hidden="true"
                >
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Connect with {providerLabel}
            </h2>
            <p className="text-white/50 text-sm mb-8">
              Click below to securely authenticate. You'll be asked to verify
              your {providerLabel} account.
            </p>
            <button
              type="button"
              onClick={handleConnect}
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3"
              style={{ backgroundColor: providerColor, color: "#fff" }}
            >
              {isLoggingIn ? (
                <>
                  <span className="animate-spin w-5 h-5 border-2 border-white/40 border-t-white rounded-full inline-block" />{" "}
                  Connecting...
                </>
              ) : (
                <>Connect {providerLabel} Account</>
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep("choose")}
              className="mt-4 text-white/40 hover:text-white/60 text-sm underline"
            >
              ← Use a different method
            </button>
          </div>
        )}

        {/* STEP 3: Profile form (new users) */}
        {step === "profile" && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Complete Your Profile
            </h2>
            <p className="text-white/50 text-sm mb-5">
              All fields marked * are required.
            </p>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="pname"
                  className="block text-white/70 text-sm font-medium mb-1"
                >
                  Your Name{" "}
                  <span className="text-white/30 text-xs">(optional)</span>
                </label>
                <input
                  id="pname"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="pemail"
                  className="block text-white/70 text-sm font-medium mb-1"
                >
                  Email Address <span style={{ color: "#C8A24A" }}>*</span>
                </label>
                <input
                  id="pemail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: email
                      ? "1px solid rgba(200,162,74,0.5)"
                      : "1px solid rgba(255,255,255,0.15)",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="pcountry"
                  className="block text-white/70 text-sm font-medium mb-1"
                >
                  Country <span style={{ color: "#C8A24A" }}>*</span>
                </label>
                <select
                  id="pcountry"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{
                    backgroundColor: "#0D2B1A",
                    border: country
                      ? "1px solid rgba(200,162,74,0.5)"
                      : "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <option value="" style={{ backgroundColor: "#0D2B1A" }}>
                    Select your country
                  </option>
                  {COUNTRIES.map((c) => (
                    <option
                      key={c}
                      value={c}
                      style={{ backgroundColor: "#0D2B1A" }}
                    >
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="pphone"
                  className="block text-white/70 text-sm font-medium mb-1"
                >
                  Phone Number <span style={{ color: "#C8A24A" }}>*</span>
                </label>
                <input
                  id="pphone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: phone
                      ? "1px solid rgba(200,162,74,0.5)"
                      : "1px solid rgba(255,255,255,0.15)",
                  }}
                />
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving || !email.trim() || !country || !phone.trim()}
              className="w-full mt-6 py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
            >
              {saving ? "Saving..." : "Enter My Decision Twin"}
            </button>
          </div>
        )}

        {/* STEP 4: Returning user confirmation */}
        {step === "returning" && (
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(200,162,74,0.12)",
                border: "1px solid rgba(200,162,74,0.35)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 14l6 6L23 8"
                  stroke="#C8A24A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Identity Verified
            </h2>
            {existingProfile?.email && (
              <div
                className="inline-block px-3 py-1.5 rounded-full text-sm mb-4"
                style={{
                  backgroundColor: "rgba(200,162,74,0.1)",
                  color: "#C8A24A",
                  border: "1px solid rgba(200,162,74,0.25)",
                }}
              >
                {existingProfile.email}
              </div>
            )}
            {existingProfile?.name && (
              <p className="text-white/60 text-sm mb-1">
                Welcome back,{" "}
                <strong className="text-white">{existingProfile.name}</strong>
              </p>
            )}
            {existingProfile?.country && (
              <p className="text-white/40 text-xs mb-6">
                {existingProfile.country}
              </p>
            )}
            {!existingProfile?.email && !existingProfile?.name && (
              <p className="text-white/50 text-sm mb-6">
                Your Decision Twin is ready.
              </p>
            )}
            <button
              type="button"
              onClick={onSuccess}
              className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
            >
              Enter My Decision Twin →
            </button>
            <button
              type="button"
              onClick={() => setStep("choose")}
              className="mt-4 text-white/30 hover:text-white/50 text-xs underline block w-full"
            >
              Sign in with a different account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
