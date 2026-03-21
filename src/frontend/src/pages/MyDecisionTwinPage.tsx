import { useState } from "react";
import { AuthModal } from "../components/AuthModal";
import { Footer } from "../components/Footer";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface MyDecisionTwinPageProps {
  onNavigate: (page: string) => void;
}

const TAB_CARDS = [
  {
    icon: "🧠",
    title: "My Mind Twin",
    subtitle: "Your living decision profile",
    whatYouDo: "Take the 36-question HDA-DCFM assessment",
    whatYouGet: [
      "Base twin radar chart across all 6 dimensions",
      "Dimension scores with behavioral interpretation",
      "Full assessment history and progress over time",
    ],
  },
  {
    icon: "🎛️",
    title: "Twin Builder",
    subtitle: "Design alternate versions of you",
    whatYouDo: "Adjust 6 dimension sliders, name and save versions",
    whatYouGet: [
      'Saved twin profiles like "Calm Me", "Bold Me", "Future Me"',
      "Live DCFM Decision Force preview as you adjust",
      "Unlimited named versions to model different selves",
    ],
  },
  {
    icon: "📂",
    title: "My Versions",
    subtitle: "Compare your twins side by side",
    whatYouDo: "Select any two saved versions to compare",
    whatYouGet: [
      "Side-by-side radar chart comparison",
      "Delta overview showing exact dimension gaps",
      "Visual clarity on what changed and by how much",
    ],
  },
  {
    icon: "⚗️",
    title: "Simulation Lab",
    subtitle: "Test decisions before making them",
    whatYouDo: "Enter a real scenario, select twin versions to run",
    whatYouGet: [
      "Decision Force scores per version",
      "Outcome prediction: hesitate, decide confidently, or conflict",
      "Insight into which version of you handles the scenario best",
    ],
  },
  {
    icon: "📈",
    title: "Growth Path",
    subtitle: "Your roadmap to becoming your target self",
    whatYouDo: "Pick current + target twin, log real decisions",
    whatYouGet: [
      "Delta Engine gap analysis with exact % change needed",
      "AI coaching tips to close each dimension gap",
      "Decision log to track real-world outcomes over time",
    ],
  },
];

const STEPS = [
  {
    num: "01",
    title: "Take HDA-DCFM Assessment",
    desc: "Complete the 36-question survey inside your dashboard. Your answers generate your base twin profile.",
  },
  {
    num: "02",
    title: "Build Your Twin Versions",
    desc: "Use sliders to customize your emotional, risk, and execution dimensions. Save named versions like 'Bold Me'.",
  },
  {
    num: "03",
    title: "Simulate & Evolve",
    desc: "Run decision scenarios across your twin versions. Track growth over time and log real outcomes.",
  },
];

const FAQ_ITEMS = [
  {
    q: "How often should I train?",
    a: "We recommend taking the HDA-DCFM assessment once every 4–6 weeks. This gives enough time for real behavioral change to register. Training more frequently than once a week will produce noise, not signal.",
  },
  {
    q: "Will I get the same questions every time?",
    a: "The core 36-question structure stays consistent across sessions — this is by design. Consistency is what makes your progress trackable and scientifically valid. Future updates may introduce supplementary question sets for deeper dimension drilling.",
  },
  {
    q: "Why do I need multiple versions?",
    a: "A single score is a snapshot. Versions let you model who you want to become — 'Calm Me', 'Bold Me', 'Future Me' — and then simulate decisions through each lens. It turns self-awareness into a design tool.",
  },
  {
    q: "What does the Growth Path actually do?",
    a: "The Delta Engine compares your Current Twin to your Target Twin and shows the exact percentage change needed in each dimension. Each gap comes with a specific coaching tip to help you close it through daily habit.",
  },
  {
    q: "Is my data private?",
    a: "All your assessment scores, twin versions, and decision logs are stored securely on the Internet Computer blockchain. Only you and the platform admin can access your data.",
  },
];

export function MyDecisionTwinPage({ onNavigate }: MyDecisionTwinPageProps) {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const [showAuth, setShowAuth] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleCreateTwin = async () => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    if (actor) {
      const done = await actor.hasCompletedProfile().catch(() => false);
      if (done) {
        onNavigate("userDashboard");
      } else {
        setShowAuth(true);
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A1F14" }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0D2B1A 0%, #1B4332 60%, #0A1F14 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, #C8A24A 0%, transparent 60%), radial-gradient(circle at 70% 20%, #C8A24A 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{
              backgroundColor: "rgba(200,162,74,0.12)",
              color: "#C8A24A",
              border: "1px solid rgba(200,162,74,0.25)",
            }}
          >
            HDA-DCFM Framework
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Create Your
            <span style={{ color: "#C8A24A" }}> Decision Twin.</span>
            <br />
            Test Your Future Before Living It.
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
            A Personal Mind Twin is a configurable model that replicates how{" "}
            <em>you</em> make decisions — and lets you simulate alternate
            versions of yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={handleCreateTwin}
              data-ocid="hero.primary_button"
              className="px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
            >
              Create My Decision Twin
            </button>
            {isAuthenticated && (
              <button
                type="button"
                data-ocid="hero.dashboard.button"
                onClick={() => onNavigate("userDashboard")}
                className="px-8 py-4 rounded-xl font-bold text-base transition-all hover:bg-white/10"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                }}
              >
                Go to My Dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      {/* What is PMT */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-4">
            What is a Personal Mind Twin?
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Most tools tell you who you are. The Personal Mind Twin lets you{" "}
            <strong className="text-white">
              design who you want to become
            </strong>{" "}
            — and simulate decisions before you make them.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Earlier",
              icon: "❌",
              text: "System tells you who you are",
            },
            {
              label: "Now",
              icon: "✅",
              text: "You build and evolve your own mind model",
            },
            {
              label: "Powered By",
              icon: "🔬",
              text: "HDA-DCFM Framework — 6 decision dimensions",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl p-6 text-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <div
                className="text-xs font-semibold mb-2"
                style={{ color: "#C8A24A" }}
              >
                {item.label}
              </div>
              <p className="text-white/70 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works steps */}
      <div
        style={{
          backgroundColor: "rgba(200,162,74,0.04)",
          borderTop: "1px solid rgba(200,162,74,0.1)",
          borderBottom: "1px solid rgba(200,162,74,0.1)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="relative">
                <div
                  className="text-5xl font-bold mb-4"
                  style={{ color: "rgba(200,162,74,0.2)" }}
                >
                  {step.num}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inside Your Dashboard — 5 detailed tab cards */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            Inside Your Dashboard
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto">
            Five dedicated tabs, each with a specific purpose in building,
            simulating, and evolving your decision twin.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TAB_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl leading-none">{card.icon}</span>
                <div>
                  <h3 className="text-white font-bold text-base leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "#C8A24A" }}>
                    {card.subtitle}
                  </p>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
                  What you do
                </div>
                <p className="text-white/65 text-sm">{card.whatYouDo}</p>
              </div>
              <div>
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                  What you get
                </div>
                <ul className="space-y-1.5">
                  {card.whatYouGet.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-white/60 text-xs"
                    >
                      <span style={{ color: "#C8A24A", flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Go to Dashboard CTA after features */}
        {isAuthenticated && (
          <div className="text-center mt-10">
            <button
              type="button"
              data-ocid="features.dashboard.button"
              onClick={() => onNavigate("userDashboard")}
              className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
            >
              Go to My Dashboard →
            </button>
          </div>
        )}
      </div>

      {/* FAQ / Training Guide */}
      <div
        style={{
          backgroundColor: "rgba(200,162,74,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Training Your Twin
            </h2>
            <p className="text-white/50 text-sm">
              Everything you need to know about getting the most from My
              Decision Twin.
            </p>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={item.q}
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <button
                  type="button"
                  data-ocid={`faq.item.${i + 1}`}
                  className="w-full text-left flex items-center justify-between gap-4 px-5 py-4 text-white font-medium text-sm transition-colors hover:text-white/80"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <span
                    className="text-lg leading-none transition-transform"
                    style={{
                      color: "#C8A24A",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0)",
                      display: "inline-block",
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-white/60 text-sm leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Admin reassurance note */}
          <p className="text-center text-white/30 text-xs mt-8">
            🔒 The Admin Panel is only visible to the platform administrator —
            regular users will never see it.
          </p>
        </div>
      </div>

      {/* DCFM formula */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
            border: "1px solid rgba(200,162,74,0.25)",
          }}
        >
          <div
            className="text-xs font-semibold mb-3"
            style={{ color: "#C8A24A", letterSpacing: "0.1em" }}
          >
            DCFM SIMULATION ENGINE
          </div>
          <div className="font-mono text-white text-lg font-bold mb-2">
            Decision_Force = (EM + RRM + IAI) - (SIS + (10 - EDI))
          </div>
          <p className="text-white/55 text-sm">
            Based on the Dynamic Cognitive Field Manifold framework by Sathish
            Sampath &amp; MESMA
          </p>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center pb-24 px-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Ready to design yourself?
        </h2>
        <p className="text-white/50 mb-8">
          "You're not just analyzing the mind anymore. You're letting people
          design and simulate it."
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            data-ocid="cta.primary_button"
            onClick={handleCreateTwin}
            className="px-10 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
          >
            Create My Decision Twin
          </button>
          {isAuthenticated && (
            <button
              type="button"
              data-ocid="cta.dashboard.button"
              onClick={() => onNavigate("userDashboard")}
              className="px-10 py-4 rounded-xl font-bold text-base transition-all hover:bg-white/10"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
              }}
            >
              Go to My Dashboard
            </button>
          )}
        </div>
      </div>

      <Footer />

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            setShowAuth(false);
            onNavigate("userDashboard");
          }}
        />
      )}
    </div>
  );
}
