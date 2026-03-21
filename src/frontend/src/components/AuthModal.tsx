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

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { actor } = useActor();
  const [step, setStep] = useState<"login" | "profile">("login");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    if (isAuthenticated && actor) {
      actor
        .hasCompletedProfile()
        .then((done) => {
          if (done) onSuccess();
          else setStep("profile");
        })
        .catch(() => setStep("profile"));
    }
  }, [isAuthenticated, actor, onSuccess]);

  const handleSaveProfile = async () => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8"
        style={{
          backgroundColor: "#1B4332",
          border: "1px solid rgba(200,162,74,0.35)",
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

        {step === "login" && (
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
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
              Create Your Decision Twin
            </h2>
            <p className="text-white/60 text-sm mb-8">
              Sign in with Internet Identity to get started. Secure, private,
              and passwordless.
            </p>
            <button
              type="button"
              onClick={login}
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3"
              style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
            >
              {isLoggingIn ? (
                <>
                  <span className="animate-spin w-5 h-5 border-2 border-green-800 border-t-transparent rounded-full inline-block" />{" "}
                  Signing in...
                </>
              ) : (
                <>Sign In with Internet Identity</>
              )}
            </button>
            <p className="text-white/30 text-xs mt-4">
              Internet Identity is ICP's secure, passwordless authentication
              system.
            </p>
          </div>
        )}

        {step === "profile" && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Complete Your Profile
            </h2>
            <p className="text-white/60 text-sm mb-5">
              Country and phone are required to activate your twin.
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
                    backgroundColor: "#1B4332",
                    border: country
                      ? "1px solid rgba(200,162,74,0.5)"
                      : "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <option value="" style={{ backgroundColor: "#1B4332" }}>
                    Select your country
                  </option>
                  {COUNTRIES.map((c) => (
                    <option
                      key={c}
                      value={c}
                      style={{ backgroundColor: "#1B4332" }}
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
              <div>
                <label
                  htmlFor="pemail"
                  className="block text-white/70 text-sm font-medium mb-1"
                >
                  Email{" "}
                  <span className="text-white/30 text-xs">(optional)</span>
                </label>
                <input
                  id="pemail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving || !country || !phone.trim()}
              className="w-full mt-6 py-3 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
            >
              {saving ? "Saving..." : "Enter My Decision Twin"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
