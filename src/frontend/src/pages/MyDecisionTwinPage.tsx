import { motion } from "motion/react";
import { useState } from "react";
import { AuthModal } from "../components/AuthModal";
import { Footer } from "../components/Footer";

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
  {
    icon: "📓",
    title: "My Day Journal",
    subtitle: "Train your twin with daily reflection",
    whatYouDo: "Record audio, video, or text about your day",
    whatYouGet: [
      "Auto-timestamped journal entries, unlimited",
      "AI analysis: sentiment, emotion tone, DCFM signals",
      "Daily training data that deepens your twin over time",
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
    title: "Simulate and Evolve",
    desc: "Run decision scenarios across your twin versions. Track growth over time and log real outcomes.",
  },
];

const REVEALS = [
  {
    icon: "⏸️",
    title: "Why you hesitate",
    desc: "Uncover your emotional resistance patterns — the subconscious filters that stall decisions before they begin.",
  },
  {
    icon: "⚡",
    title: "How you decide under pressure",
    desc: "Understand your stress-mode decision profile — what you default to when logic competes with emotion.",
  },
  {
    icon: "🔍",
    title: "Where your decisions break down",
    desc: "Identify your weakest cognitive links — the dimensions that most often derail your best intentions.",
  },
  {
    icon: "🚀",
    title: "Who you can become",
    desc: "Model and simulate your future decision self — and create a real training path to bridge the gap.",
  },
];

const PLATFORM_STATS = [
  {
    label: "6 Decision Dimensions",
    sub: "Mapped to your unique cognitive profile",
    icon: "🎯",
  },
  {
    label: "HDA-DCFM Framework",
    sub: "Patent-pending decision science",
    icon: "🔬",
  },
  {
    label: "360° Mind Twin",
    sub: "Covers all life and business domains",
    icon: "🌐",
  },
];

const FAQ_ITEMS = [
  {
    q: "How often should I train?",
    a: "We recommend taking the HDA-DCFM assessment once every 4-6 weeks. This gives enough time for real behavioral change to register. Training more frequently than once a week will produce noise, not signal.",
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
  const [showAuth, setShowAuth] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCreateTwin = () => {
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A1F14" }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #061510 0%, #0D2B1A 40%, #1B4332 80%, #0A1F14 100%)",
        }}
      >
        {/* Decorative glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 60%, rgba(200,162,74,0.08) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(200,162,74,0.06) 0%, transparent 50%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(200,162,74,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,162,74,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
              style={{
                backgroundColor: "rgba(200,162,74,0.12)",
                color: "#C8A24A",
                border: "1px solid rgba(200,162,74,0.3)",
              }}
            >
              <span>Patent Pending</span>
              <span style={{ color: "rgba(200,162,74,0.5)" }}>|</span>
              <span>HDA-DCFM Framework</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Create Your
              <span style={{ color: "#C8A24A" }}> Decision Twin.</span>
              <br />
              <span className="text-3xl lg:text-5xl text-white/80">
                Test Your Future Before Living It.
              </span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              A Personal Mind Twin (PMT) is a configurable cognitive model built
              from the{" "}
              <span style={{ color: "#C8A24A" }}>
                Dynamic Cognitive Field Manifold
              </span>{" "}
              framework. It replicates how{" "}
              <em className="text-white/80">you</em> make decisions — and lets
              you simulate alternate versions of yourself across every domain of
              life and business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={handleCreateTwin}
                data-ocid="pmt.primary_button"
                className="px-10 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95 shadow-lg"
                style={{
                  backgroundColor: "#C8A24A",
                  color: "#0A1F14",
                  boxShadow: "0 0 30px rgba(200,162,74,0.25)",
                }}
              >
                Create My Decision Twin
              </button>
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("pmt-how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-10 py-4 rounded-xl font-bold text-base transition-all"
                style={{
                  border: "1px solid rgba(200,162,74,0.3)",
                  color: "rgba(200,162,74,0.85)",
                  backgroundColor: "transparent",
                }}
              >
                See How It Works
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Platform Stats Strip */}
      <div
        style={{
          background: "rgba(200,162,74,0.06)",
          borderTop: "1px solid rgba(200,162,74,0.15)",
          borderBottom: "1px solid rgba(200,162,74,0.15)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLATFORM_STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 justify-center md:justify-start"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: "rgba(200,162,74,0.12)" }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">
                    {stat.label}
                  </div>
                  <div className="text-white/50 text-xs mt-0.5">{stat.sub}</div>
                </div>
              </div>
            ))}
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
              label: "Traditional Tools",
              icon: "❌",
              text: "Tell you who you are today. Static snapshot. No simulation.",
            },
            {
              label: "PMT Difference",
              icon: "✅",
              text: "Build and evolve your own mind model. Version it. Simulate it.",
            },
            {
              label: "Powered By",
              icon: "🔬",
              text: "HDA-DCFM Framework — 6 decision dimensions, patent pending.",
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

      {/* What the PMT Reveals */}
      <div
        style={{
          backgroundColor: "rgba(10,31,20,0.8)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">
              What Your Decision Twin Reveals
            </h2>
            <p className="text-white/50 text-sm max-w-xl mx-auto">
              Four deep truths about how you decide — that no other assessment
              tool can surface.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVEALS.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-7 flex gap-5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(27,67,50,0.6), rgba(10,31,20,0.4))",
                  border: "1px solid rgba(200,162,74,0.18)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "rgba(200,162,74,0.12)" }}
                >
                  {r.icon}
                </div>
                <div>
                  <h3
                    className="font-bold text-base mb-2"
                    style={{ color: "#C8A24A" }}
                  >
                    {r.title}
                  </h3>
                  <p className="text-white/65 text-sm leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works steps */}
      <div
        id="pmt-how-it-works"
        style={{
          backgroundColor: "rgba(200,162,74,0.04)",
          borderTop: "1px solid rgba(200,162,74,0.1)",
          borderBottom: "1px solid rgba(200,162,74,0.1)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How to Get Started
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

      {/* Inside Your Dashboard */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            Inside Your Dashboard
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto">
            Six dedicated tabs, each with a specific purpose in building,
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

        <div className="text-center mt-10">
          <button
            type="button"
            onClick={handleCreateTwin}
            data-ocid="pmt.secondary_button"
            className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
          >
            Sign In to Access Your Dashboard
          </button>
        </div>
      </div>

      {/* FAQ */}
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
                  className="w-full text-left flex items-center justify-between gap-4 px-5 py-4 text-white font-medium text-sm transition-colors hover:text-white/80"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-ocid={`pmt.toggle.${i + 1}` as string}
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
          <p className="text-center text-white/30 text-xs mt-8">
            The Admin Panel is only visible to the platform administrator —
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
      <div
        className="text-center pb-24 px-6"
        style={{
          background: "linear-gradient(0deg, #061510 0%, transparent 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to design yourself?
          </h2>
          <p className="text-white/50 mb-10 leading-relaxed">
            "You are not just analyzing the mind anymore. You are letting people
            design and simulate it."
          </p>
          <button
            type="button"
            onClick={handleCreateTwin}
            data-ocid="pmt.submit_button"
            className="px-12 py-5 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: "#C8A24A",
              color: "#0A1F14",
              boxShadow: "0 0 40px rgba(200,162,74,0.3)",
            }}
          >
            Start Building My Twin
          </button>
        </motion.div>
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
