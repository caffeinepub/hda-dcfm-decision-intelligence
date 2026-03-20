interface NavbarProps {
  onNavigate: (page: string) => void;
  transparent?: boolean;
}

export function Navbar({ onNavigate, transparent = false }: NavbarProps) {
  return (
    <header
      className={`sticky top-0 z-50 w-full ${
        transparent ? "bg-transparent" : "bg-navy-dark border-b border-white/10"
      }`}
      style={{ backgroundColor: transparent ? undefined : "#1B4332" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-3 group"
          data-ocid="nav.link"
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="19"
              cy="19"
              r="17"
              fill="rgba(200,162,74,0.1)"
              stroke="rgba(200,162,74,0.35)"
              strokeWidth="1.2"
            />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 19 + Math.cos(rad) * 11;
              const y1 = 19 + Math.sin(rad) * 11;
              const x2 = 19 + Math.cos(rad) * 15;
              const y2 = 19 + Math.sin(rad) * 15;
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#C8A24A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              );
            })}
            <circle cx="19" cy="19" r="7" fill="#C8A24A" opacity="0.9" />
            <text
              x="19"
              y="23"
              textAnchor="middle"
              fill="#1B4332"
              fontSize="9"
              fontWeight="800"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              e
            </text>
          </svg>
          <div className="flex flex-col items-start leading-tight">
            <span
              className="text-white font-bold text-xl tracking-wide"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              elidi
            </span>
            <span
              className="text-xs font-normal"
              style={{ color: "rgba(200,162,74,0.75)", lineHeight: 1.2 }}
            >
              (HDA-DCFM Decision Intelligence)
            </span>
          </div>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            type="button"
            onClick={() => onNavigate("landing")}
            className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            data-ocid="nav.link"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate("dimensions")}
            className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            data-ocid="nav.link"
          >
            Dimensions
          </button>
          <button
            type="button"
            onClick={() => onNavigate("howitworks")}
            className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            data-ocid="nav.link"
          >
            How It Works
          </button>
        </nav>

        {/* CTA */}
        <button
          type="button"
          onClick={() => onNavigate("assessment")}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
          data-ocid="nav.primary_button"
        >
          Start Assessment
        </button>
      </div>
    </header>
  );
}
