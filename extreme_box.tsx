
function ExtremeHighlightBox({ type, icon, label, text }: { type: 'critical' | 'warning' | 'insight'; icon: string; label: string; text: string }) {
  const colors = {
    critical: { border: '#DC2626', bg: 'rgba(220,38,38,0.08)', glow: 'rgba(220,38,38,0.15)', label: '#ff6666', text: '#fca5a5' },
    warning: { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', glow: 'rgba(245,158,11,0.12)', label: '#fbbf24', text: '#fde68a' },
    insight: { border: '#14b8a6', bg: 'rgba(20,184,166,0.08)', glow: 'rgba(20,184,166,0.12)', label: '#2dd4bf', text: '#99f6e4' },
  };
  const c = colors[type];
  return (
    <div className="my-6 rounded-xl p-5" style={{ background: c.bg, borderLeft: `4px solid ${c.border}`, boxShadow: `0 0 20px ${c.glow}, inset 0 0 20px ${c.glow}`, border: `1px solid ${c.border}40`, borderLeftWidth: 4, borderLeftColor: c.border }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-black tracking-widest uppercase" style={{ color: c.label }}>{label}</span>
      </div>
      <p className="text-sm leading-relaxed font-medium" style={{ color: c.text }}>"{text}"</p>
    </div>
  );
}

