import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../components/Footer";

const DIMENSIONS = [
  {
    abbr: "PM",
    name: "Process Management",
    color: "#C8A24A",
    desc: "Structured, systematic approaches to decision-making workflows that ensure consistency and rigor across high-stakes choices.",
  },
  {
    abbr: "EM",
    name: "Emotional Management",
    color: "#7B9FC7",
    desc: "Regulation of emotional states to enable clear judgment and leverage self-awareness as a strategic decision asset.",
  },
  {
    abbr: "RRM",
    name: "Risk & Reward Management",
    color: "#82B89A",
    desc: "Calibrated assessment of uncertainty versus opportunity, with sophisticated scenario-planning and tolerance thresholds.",
  },
  {
    abbr: "IAI",
    name: "Information & Analytical Intelligence",
    color: "#C4A882",
    desc: "Data gathering, synthesis, and analytical reasoning that reduces cognitive bias and elevates decision quality.",
  },
  {
    abbr: "SIS",
    name: "Social & Interpersonal Skills",
    color: "#A688C4",
    desc: "Leveraging relationships, stakeholder dynamics, and collaborative intelligence to reach better collective decisions.",
  },
  {
    abbr: "EDI",
    name: "Executive Decision Intelligence",
    color: "#E08A7A",
    desc: "Strategic thinking, high-stakes decision execution, and full accountability for outcomes at the highest levels.",
  },
];

const ROLE_TAGS = [
  "Human Decision Architect",
  "Mind Hack Specialist",
  "CEO, MESMA",
  "Certified Social Behaviour Psychologist",
  "Hypnotherapist",
  "International Keynote Speaker",
  "Award-Winning Author",
  "Fellow of Royal Society for Public Health",
];

const CREDENTIALS = [
  "FRSPH",
  "1000+ Talks",
  "Multi-domain Expertise",
  "Published Author",
  "International Speaker",
];

const MESMA_AREAS = [
  {
    icon: "🔬",
    title: "Research Works",
    desc: "Constant research in better understanding and interpretation of the Mind and its application in modern treatments. Mindfulness as the canvas.",
  },
  {
    icon: "🏢",
    title: "Corporate Trainings",
    desc: "Leadership, Behavioural Intelligence, Employee Mind Activation, Corporate Culture and Impact Support. Giving corporates the mindful intelligence edge.",
  },
  {
    icon: "🧠",
    title: "Mind Activation Workshops",
    desc: "Mindfulness-based workshops in the domain of Mental Wellness and Supreme Mind Activation for better health and a happy lifestyle.",
  },
];

const BOOKS = [
  {
    title: '"I Got You" — Hacking the Human Mind',
    subtitle:
      "Proven Psychological Strategies for Effective Sales and Marketing",
    category: "Psychology & Marketing",
    desc: "Unlock the psychology of persuasion with principles like anchoring, scarcity, reciprocity, and social proof. Ethically influence decisions and inspire lasting trust.",
    url: "https://www.amazon.in/Got-You-Psychological-Strategies-Effective-ebook/dp/B0DQ7WV4VH",
  },
  {
    title: "Silent Cries, Invisible Hurts, Troubled Souls",
    subtitle: "See Them Before They Break",
    category: "Mental Health",
    desc: "A life-span guide to recognising emotional suffering before it becomes crisis — for students, professionals, and seniors. Blends psychology, observation, and compassionate storytelling.",
    url: "https://www.amazon.in/Silent-Cries-Invisible-Hurts-Troubled-ebook/dp/B0GCZFT2MD",
  },
  {
    title: "Sounds Great!!! Let Me Get Back To You",
    subtitle:
      "42 Psychological Reasons Why Your Prospective Lead Didn't Come Back To Buy",
    category: "Sales Psychology",
    desc: "Decode what leads never tell you. Spot hidden hesitation, navigate objections, and turn vanishing prospects into loyal buyers.",
    url: "https://www.amazon.in/Sounds-Great-Let-Back-Psychological-ebook/dp/B0FQJPC69K",
  },
  {
    title: "Homeless Mind",
    subtitle:
      "Understanding Mental And Emotional Homelessness — And The Journey Back To Self",
    category: "Mind & Healing",
    desc: "A soul-stirring exploration of emotional homelessness — where the world sees you thriving but your heart knows it's missing. A map back to your inner home.",
    url: "https://www.amazon.in/Homeless-Mind-Understanding-Emotional-Homelessness-ebook/dp/B0FL1HT7MH",
  },
  {
    title: "The Funding Nexus",
    subtitle: "Investment Strategies for Business Growth",
    category: "Business & Finance",
    desc: "Strategic insights into funding pathways and investment models for entrepreneurs and business leaders navigating growth.",
    url: "https://www.amazon.in/Funding-Nexus-Investment-Strategies-Business-ebook/dp/B0CLHYLD1T",
  },
  {
    title: "Embrace",
    subtitle: "Cultivate Everlasting Peaceful Mindfulness",
    category: "Mindfulness",
    desc: "A guide to cultivating deep, lasting mindfulness practices that bring peace, clarity, and alignment into everyday life.",
    url: "https://www.amazon.in/Embrace-Cultivate-Everlasting-Peaceful-Mindfulness-ebook/dp/B0CLHY6G7P",
  },
  {
    title: "Brand Psychology & Marketing",
    subtitle: "Revolutionizing Marketing Strategies",
    category: "Branding",
    desc: "How psychology reshapes brand perception and consumer behaviour. A framework for marketing professionals to build brands that resonate deeply.",
    url: "https://www.amazon.in/Brand-Psychology-Marketing-Revolutionizing-Strategies/dp/8119512723",
  },
  {
    title: "Zentastic",
    subtitle: "Mindfulness Techniques for Peak Performance",
    category: "Performance & Mindfulness",
    desc: "Combining Zen practices and mindfulness techniques to develop mental performance and clarity for leaders and high achievers.",
    url: "https://www.amazon.in/Zentastic-Mindfulness-Techniques-Performance-Developing/dp/8119512464",
  },
];

interface LearnMorePageProps {
  onNavigate: (page: string) => void;
}

export function LearnMorePage({ onNavigate }: LearnMorePageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #081C2F 0%, #0B2A45 60%, #0D3358 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="absolute top-0 right-0 opacity-10"
            width="500"
            height="500"
            viewBox="0 0 500 500"
            aria-hidden="true"
          >
            <polygon
              points="250,10 480,140 480,360 250,490 20,360 20,140"
              fill="none"
              stroke="#C8A24A"
              strokeWidth="1.5"
            />
            <polygon
              points="250,50 440,160 440,340 250,450 60,340 60,160"
              fill="none"
              stroke="#C8A24A"
              strokeWidth="1"
            />
          </svg>
          <svg
            className="absolute bottom-0 left-0 opacity-10"
            width="300"
            height="300"
            viewBox="0 0 300 300"
            aria-hidden="true"
          >
            <polygon
              points="150,5 290,80 290,220 150,295 10,220 10,80"
              fill="#C8A24A"
            />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-6 pt-24 pb-28 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
              style={{
                backgroundColor: "rgba(200,162,74,0.15)",
                color: "#C8A24A",
                border: "1px solid rgba(200,162,74,0.3)",
              }}
            >
              <span>◆</span> HDA-DCFM Framework
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-4">
              The <span style={{ color: "#C8A24A" }}>HDA-DCFM</span> Framework
            </h1>
            <p className="text-xl text-white/60 mb-4 font-medium">
              Human Decision Architecture – Decision Cognitive Force Mapping
            </p>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              A pioneering framework that maps and measures the invisible
              cognitive forces behind every decision you make.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is HDA-DCFM */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="text-3xl font-bold mb-8"
              style={{ color: "#081C2F" }}
            >
              What is HDA-DCFM?
            </h2>
            <div className="space-y-5 text-gray-600 text-lg leading-relaxed mb-14">
              <p>
                <strong style={{ color: "#081C2F" }}>
                  Human Decision Architecture (HDA)
                </strong>{" "}
                is the study of the structural patterns in how individuals make
                decisions — the invisible architecture of thought, emotion,
                risk, information, social dynamics, and executive action that
                converge every time a choice is made. Just as physical
                architecture shapes how people move through space, decision
                architecture shapes how people move through choices.
              </p>
              <p>
                <strong style={{ color: "#081C2F" }}>
                  Decision Cognitive Force Mapping (DCFM)
                </strong>{" "}
                is the measurement layer — a psychometric framework that
                quantifies these forces across 6 dimensions: PM (Process
                Management), EM (Emotional Management), RRM (Risk &amp; Reward
                Management), IAI (Information &amp; Analytical Intelligence),
                SIS (Social &amp; Interpersonal Skills), and EDI (Executive
                Decision Intelligence). Together, these six forces determine the
                quality, speed, and consistency of every decision you make.
              </p>
            </div>

            {/* 6 Dimensions Grid */}
            <h3 className="text-xl font-bold mb-8" style={{ color: "#081C2F" }}>
              The Six Decision Forces
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {DIMENSIONS.map((dim, i) => (
                <motion.div
                  key={dim.abbr}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  style={{ backgroundColor: `${dim.color}08` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold"
                      style={{
                        backgroundColor: `${dim.color}20`,
                        color: dim.color,
                      }}
                    >
                      {dim.abbr}
                    </span>
                    <h4
                      className="font-bold text-sm"
                      style={{ color: "#081C2F" }}
                    >
                      {dim.name}
                    </h4>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {dim.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <div
              className="rounded-xl p-7 text-base italic leading-relaxed"
              style={{
                borderLeft: "4px solid #C8A24A",
                backgroundColor: "rgba(200,162,74,0.05)",
                color: "#3a3a3a",
              }}
            >
              &ldquo;HDA-DCFM does not measure intelligence — it maps the forces
              that determine whether your intelligence gets applied well.&rdquo;
              <div
                className="mt-3 text-sm font-semibold not-italic"
                style={{ color: "#C8A24A" }}
              >
                — Sathish Sampath, FRSPH · Creator, HDA-DCFM
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Sathish Sampath */}
      <section
        className="py-24"
        style={{
          background:
            "linear-gradient(135deg, #061218 0%, #081C2F 60%, #0a2010 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-16 h-0.5 mb-8"
              style={{ backgroundColor: "#C8A24A" }}
            />
            <p
              className="text-xs tracking-[0.35em] uppercase mb-4"
              style={{ color: "#C8A24A" }}
            >
              The Mind Behind elidi
            </p>

            {/* Two-column layout: photo left, bio right */}
            <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
              {/* Photo */}
              <div className="flex-shrink-0 flex justify-center md:justify-start w-full md:w-auto">
                <div
                  className="rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    width: "260px",
                    border: "2px solid rgba(200,162,74,0.3)",
                  }}
                >
                  <img
                    src="/assets/uploads/05-2-1.jpg"
                    alt="Sathish Sampath"
                    className="rounded-2xl object-cover w-full max-w-xs"
                    style={{
                      aspectRatio: "3/4",
                      objectPosition: "50% 10%",
                    }}
                  />
                </div>
              </div>

              {/* Bio content */}
              <div className="flex-1 min-w-0">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Sathish Sampath,{" "}
                  <span style={{ color: "#C8A24A" }}>FRSPH</span>
                </h2>
                <p
                  className="text-sm uppercase tracking-widest mb-6"
                  style={{ color: "#C8A24A99" }}
                >
                  Human Decision Architect · Mind Hack Specialist · CEO, MESMA
                </p>

                {/* Role Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {ROLE_TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: "rgba(200,162,74,0.12)",
                        color: "#C8A24A",
                        border: "1px solid rgba(200,162,74,0.25)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bio */}
                <div className="space-y-5 text-white/75 text-base leading-relaxed mb-10">
                  <p>
                    Sathish Sampath hails from Madurai (born 1979), now settled
                    in Chennai, India. With a multifaceted background spanning
                    Technology, Hospitality, and Healthcare, he is a successful
                    entrepreneur, Mindfulness Coach, and Strategic Corporate
                    Advisor on Business Growth and Global Marketing.
                  </p>
                  <p>
                    He has delivered{" "}
                    <strong className="text-white">
                      1,000+ guest lectures, training sessions, and keynotes
                    </strong>{" "}
                    for students, employees, and leaders across the globe on the
                    3Ms — Management, Marketing &amp; Mindfulness. As a
                    Certified Social Behaviour Psychologist and Hypnotherapist,
                    he conducts deep research in the field of Decision Making
                    and the influencing factors of the Human Mind.
                  </p>
                  <p>
                    He recently added a Diploma in International Diplomacy,
                    further sharpening his focus on leadership decision dynamics
                    in the highest boardrooms of the world. He is the creator of
                    the{" "}
                    <strong className="text-white">
                      HDA-DCFM Decision Intelligence framework
                    </strong>{" "}
                    that powers elidi — the world's first psychometric system to
                    map cognitive decision forces across six dimensions.
                  </p>
                </div>

                {/* Credentials bar */}
                <div
                  className="rounded-xl p-5 flex flex-wrap gap-6"
                  style={{
                    backgroundColor: "rgba(200,162,74,0.1)",
                    border: "1px solid rgba(200,162,74,0.2)",
                  }}
                >
                  {CREDENTIALS.map((cred) => (
                    <span
                      key={cred}
                      className="text-sm font-semibold"
                      style={{ color: "#C8A24A" }}
                    >
                      {cred}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About MESMA */}
      <section className="py-24" style={{ backgroundColor: "#F3F6F9" }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: "#081C2F" }}
            >
              Powered by MESMA Lab
            </h2>
            <p
              className="text-lg font-medium mb-6"
              style={{ color: "#C8A24A" }}
            >
              Mindfulness Enabled Supreme Mind Activation
            </p>
            <p className="text-gray-600 text-base leading-relaxed max-w-3xl">
              MESMA Lab is the research and development engine behind elidi.
              Founded by Sathish Sampath, MESMA pioneers the intersection of
              mindfulness, behavioural intelligence, and decision science —
              turning research into actionable tools for individuals and
              organisations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {MESMA_AREAS.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{area.icon}</div>
                <h3
                  className="font-bold text-base mb-3"
                  style={{ color: "#081C2F" }}
                >
                  {area.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {area.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Award note */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-xl p-6 mb-8 flex items-start gap-4"
            style={{
              backgroundColor: "rgba(200,162,74,0.1)",
              border: "1px solid rgba(200,162,74,0.25)",
            }}
          >
            <span className="text-2xl mt-0.5">🏆</span>
            <p className="text-sm leading-relaxed" style={{ color: "#5a4010" }}>
              <strong>MESMA Lab won the Best Research Paper Award 2026</strong>{" "}
              at IANDSC 2026 — conferred to{" "}
              <strong>Sathish Sampath FRSPH, CEO MESMA Lab</strong>, recognising
              outstanding contribution to Mind Science and Behavioural
              Intelligence research.
            </p>
          </motion.div>

          <a
            href="https://www.mesmalab.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "#081C2F", color: "#C8A24A" }}
            data-ocid="mesma.link"
          >
            Visit MESMA Lab
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Books */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: "#081C2F" }}
            >
              Published Works
            </h2>
            <p className="text-gray-500 text-base">
              8 books by Sathish Sampath on human psychology, decision
              intelligence, mindfulness, and business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {BOOKS.map((book, i) => (
              <motion.div
                key={book.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
                className="rounded-2xl p-7 border shadow-sm hover:shadow-md transition-shadow flex flex-col"
                style={{
                  borderColor: "rgba(200,162,74,0.3)",
                  backgroundColor: "rgba(200,162,74,0.03)",
                }}
              >
                {/* Category pill */}
                <div
                  className="inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-semibold mb-4"
                  style={{
                    backgroundColor: "rgba(200,162,74,0.15)",
                    color: "#C8A24A",
                  }}
                >
                  {book.category}
                </div>

                <h3
                  className="text-base font-bold mb-1 leading-snug"
                  style={{ color: "#081C2F" }}
                >
                  {book.title}
                </h3>
                <p
                  className="text-xs font-medium mb-3"
                  style={{ color: "#6a6a6a" }}
                >
                  {book.subtitle}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">
                  {book.desc}
                </p>

                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80 mt-auto"
                  style={{ color: "#C8A24A" }}
                  data-ocid={"books.amazon_link"}
                >
                  View on Amazon India
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </div>

          <p className="text-sm text-gray-400 italic">
            Available on{" "}
            <a
              href="https://www.amazon.in/stores/Sathish-Sampath/author/B0CLD5K6BW"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:opacity-80 transition-opacity"
              style={{ color: "#C8A24A" }}
            >
              Amazon India — Sathish Sampath Author Page
            </a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6"
        style={{
          background:
            "linear-gradient(135deg, #0D3A1E 0%, #1B4332 60%, #2D6A4F 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to discover your Decision Intelligence?
            </h2>
            <p className="text-white/60 mb-8 text-base">
              Take the HDA-DCFM assessment and get your complete decision
              intelligence profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => onNavigate("assessment")}
                className="px-10 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95 shadow-lg"
                style={{ backgroundColor: "#C8A24A", color: "#081C2F" }}
                data-ocid="cta.primary_button"
              >
                Take the Assessment
              </button>
              <button
                type="button"
                onClick={() => onNavigate("landing")}
                className="px-10 py-4 rounded-xl font-semibold text-base text-white/80 border border-white/20 hover:border-white/40 hover:text-white transition-all"
                data-ocid="cta.secondary_button"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
