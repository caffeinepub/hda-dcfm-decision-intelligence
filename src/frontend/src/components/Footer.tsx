export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer style={{ backgroundColor: "#0A2B1A" }} className="text-white/70">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* elidi brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              {/* Sun logo mark */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                aria-hidden="true"
              >
                {/* Rays */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 18 + Math.cos(rad) * 10;
                  const y1 = 18 + Math.sin(rad) * 10;
                  const x2 = 18 + Math.cos(rad) * 17;
                  const y2 = 18 + Math.sin(rad) * 17;
                  return (
                    <line
                      key={angle}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#F0C030"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  );
                })}
                {/* Sun core */}
                <circle cx="18" cy="18" r="7" fill="#F0C030" />
                <circle cx="18" cy="18" r="4.5" fill="#0A2B1A" />
                <circle cx="18" cy="18" r="2.5" fill="#F0C030" />
              </svg>
              <span
                style={{
                  color: "#F0C030",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                elidi
              </span>
            </div>
            <p
              className="text-sm mb-4"
              style={{
                color: "rgba(240,192,48,0.55)",
                letterSpacing: "0.08em",
                fontStyle: "italic",
              }}
            >
              descendants of sun
            </p>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              The Decision Intelligence Assessment platform for leaders,
              executives, and high-performers seeking clarity in complex
              decisions.
            </p>
          </div>

          <div>
            <h4
              className="font-semibold mb-4 text-sm"
              style={{ color: "rgba(240,192,48,0.9)" }}
            >
              Assessment
            </h4>
            <ul
              className="space-y-2 text-sm"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              <li>6 Core Dimensions</li>
              <li>36 Questions</li>
              <li>Archetype Profiles</li>
              <li>Detailed Reports</li>
            </ul>
          </div>

          <div>
            <h4
              className="font-semibold mb-4 text-sm"
              style={{ color: "rgba(240,192,48,0.9)" }}
            >
              Platform
            </h4>
            <ul
              className="space-y-2 text-sm"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              <li>Decision Intelligence</li>
              <li>Coaching Use Cases</li>
              <li>Leadership Development</li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="-mx-6 mt-12 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3"
          style={{ backgroundColor: "#0D3520" }}
        >
          <p
            className="text-sm font-bold tracking-wide"
            style={{ color: "#F0C030" }}
          >
            Powered by MESMA
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            &copy; {year}&nbsp;&nbsp;Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
