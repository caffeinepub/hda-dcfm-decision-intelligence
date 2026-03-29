
        {/* Section 34: Red Flag Intelligence Board */}
        <SectionCard number="34" title="🚨 Red Flag Intelligence Board — Critical Cognitive Risk Alerts">
          <style>{`
            @keyframes pulse-border {
              0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4), 0 0 12px rgba(220,38,38,0.2); border-color: rgba(220,38,38,0.6); }
              50% { box-shadow: 0 0 0 4px rgba(220,38,38,0.15), 0 0 24px rgba(220,38,38,0.35); border-color: rgba(220,38,38,0.9); }
            }
            .red-flag-card { animation: pulse-border 2.5s ease-in-out infinite; }
          `}</style>
          <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="rounded-xl px-6 py-4 flex-1" style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)' }}>
              <div className="text-3xl font-black" style={{ color: '#ff4444' }}>
                {DEMO_PROFILES.filter(p => p.alertLevel === 'critical').length}
              </div>
              <div className="text-sm text-white/60 mt-1">Critical Risk Patterns Identified in This Cohort</div>
            </div>
            <div className="rounded-xl px-6 py-4 flex-1" style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)' }}>
              <div className="text-3xl font-black" style={{ color: '#fb923c' }}>
                {DEMO_PROFILES.filter(p => p.alertLevel === 'alert').length}
              </div>
              <div className="text-sm text-white/60 mt-1">High-Alert Profiles Requiring Attention</div>
            </div>
            <div className="rounded-xl px-6 py-4 flex-1" style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.3)' }}>
              <div className="text-3xl font-black" style={{ color: '#facc15' }}>
                {DEMO_PROFILES.filter(p => p.alertLevel === 'caution').length}
              </div>
              <div className="text-sm text-white/60 mt-1">Caution Flags — Watchlist Profiles</div>
            </div>
          </div>
          <p className="text-white/50 text-sm mb-6">The following profiles represent the 15 highest-risk cognitive patterns detected by the DCFM engine. Each represents a real decision-intelligence failure mode — flagged before irreversible action was taken.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {DEMO_PROFILES.filter(p => p.alertLevel === 'critical').slice(0, 15).map((p, idx) => {
              const dims = [{ d: 'PM', v: p.pm }, { d: 'EM', v: p.em }, { d: 'RRM', v: p.rrm }, { d: 'IAI', v: p.iai }, { d: 'SIS', v: p.sis }, { d: 'EDI', v: p.edi }];
              const worst = dims.reduce((a, b) => Math.abs(b.v - 5) > Math.abs(a.v - 5) ? b : a);
              return (
                <div key={idx} className="red-flag-card rounded-2xl p-5" style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.5)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-white text-sm">{p.name}</div>
                      <div className="text-white/50 text-xs">{p.role} · {p.country}</div>
                    </div>
                    <span className="text-xs font-black px-2 py-1 rounded-md" style={{ background: 'rgba(220,38,38,0.3)', color: '#ff6666', border: '1px solid rgba(220,38,38,0.5)' }}>CRITICAL ALERT</span>
                  </div>
                  <div className="text-xs mb-3 leading-relaxed" style={{ color: '#fca5a5' }}>⚠️ {p.redFlag}</div>
                  <div className="mb-3">
                    <div className="text-xs text-white/40 mb-1">Extreme dimension: {worst.d} = <span className="font-bold" style={{ color: worst.v > 7 ? '#ff4444' : worst.v < 2 ? '#ff4444' : '#facc15' }}>{worst.v}</span></div>
                    <div className="flex gap-1">
                      {dims.map(({ d, v }) => (
                        <div key={d} className="flex-1">
                          <div className="text-center text-white/30 mb-1" style={{ fontSize: 9 }}>{d}</div>
                          <div className="rounded-full h-16 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="absolute bottom-0 left-0 right-0 rounded-full" style={{ height: `${v * 10}%`, background: v > 8 ? 'rgba(220,38,38,0.7)' : v < 2 ? 'rgba(220,38,38,0.7)' : v > 6 ? 'rgba(251,146,60,0.6)' : 'rgba(45,106,79,0.6)' }} />
                          </div>
                          <div className="text-center mt-1" style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs italic text-white/30 border-t pt-2" style={{ borderColor: 'rgba(220,38,38,0.2)' }}>Scenario: {p.scenario}</div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Section 35: Bell Curve Population Distributions */}
        <SectionCard number="35" title="📊 Population Bell Curves — Cognitive Dimension Distribution">
          <p className="text-white/50 text-sm mb-8">Distribution of all 500 profiles across each DCFM dimension. Red zones indicate danger thresholds — where cognitive patterns become risk indicators for decision failure.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {(['pm', 'em', 'rrm', 'iai', 'sis', 'edi'] as const).map((dim) => {
              const labels: Record<string, string> = { pm: 'Pattern Mastery', em: 'Emotional Magnitude', rrm: 'Risk & Reward Mapping', iai: 'Identity Anchoring Index', sis: 'Social Influence Sensitivity', edi: 'Executive Decision Integration' };
              const dangerHigh = dim === 'em' || dim === 'sis';
              const dangerLow = dim === 'iai' || dim === 'rrm' || dim === 'edi';
              const vals = DEMO_PROFILES.map(p => p[dim] as number);
              const buckets = [0,0,0,0,0,0,0,0,0];
              const ranges: [number, number][] = [[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10]];
              for (const v of vals) {
                const i = Math.min(8, Math.max(0, Math.floor(v - 1)));
                buckets[i]++;
              }
              const histData = ranges.map((r, i) => ({ range: `${r[0]}–${r[1]}`, count: buckets[i], danger: (dangerHigh && r[0] >= 8) || (dangerLow && r[1] <= 2) }));
              const maxBucket = Math.max(...buckets);
              const dangerCount = dangerHigh ? vals.filter(v => v >= 8).length : dangerLow ? vals.filter(v => v <= 2).length : 0;
              const dangerPct = Math.round(dangerCount / vals.length * 100);
              return (
                <div key={dim} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${CARD_BORDER}` }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm" style={{ color: GOLD }}>{dim.toUpperCase()}</div>
                    {(dangerHigh || dangerLow) && dangerPct > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(220,38,38,0.2)', color: '#fca5a5' }}>{dangerPct}% in danger zone</span>
                    )}
                  </div>
                  <div className="text-white/30 text-xs mb-3">{labels[dim]}</div>
                  <div className="flex items-end gap-1 h-24">
                    {histData.map((b, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full rounded-t" style={{ height: `${Math.max(4, (b.count / maxBucket) * 88)}px`, background: b.danger ? 'rgba(220,38,38,0.7)' : 'rgba(45,106,79,0.5)', border: b.danger ? '1px solid rgba(220,38,38,0.8)' : 'none' }} />
                        <div className="text-white/20" style={{ fontSize: 8 }}>{b.range}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-white/30 text-xs mt-2">
                    <span>Avg: {(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1)}</span>
                    <span>Range: {Math.min(...vals).toFixed(1)}–{Math.max(...vals).toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-xl p-4" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)' }}>
            <div className="font-bold text-sm mb-2" style={{ color: '#fca5a5' }}>🔴 Danger Zone Summary</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div><span className="text-white/50">EM &gt; 8.0:</span> <span className="font-bold" style={{ color: '#ff4444' }}>{DEMO_PROFILES.filter(p=>p.em>8).length} profiles</span> — emotional override risk</div>
              <div><span className="text-white/50">IAI &lt; 2.0:</span> <span className="font-bold" style={{ color: '#ff4444' }}>{DEMO_PROFILES.filter(p=>p.iai<2).length} profiles</span> — dangerously low self-awareness</div>
              <div><span className="text-white/50">RRM &lt; 1.5:</span> <span className="font-bold" style={{ color: '#ff4444' }}>{DEMO_PROFILES.filter(p=>p.rrm<1.5).length} profiles</span> — zero risk cognition</div>
              <div><span className="text-white/50">EDI &lt; 2.0:</span> <span className="font-bold" style={{ color: '#ff4444' }}>{DEMO_PROFILES.filter(p=>p.edi<2).length} profiles</span> — execution paralysis risk</div>
              <div><span className="text-white/50">PM&gt;8 + EDI&lt;2:</span> <span className="font-bold" style={{ color: '#facc15' }}>{DEMO_PROFILES.filter(p=>p.pm>8&&p.edi<2).length} profiles</span> — Brilliant Blocker pattern</div>
              <div><span className="text-white/50">Multi-critical:</span> <span className="font-bold" style={{ color: '#fb923c' }}>{DEMO_PROFILES.filter(p=>p.em>8&&p.iai<2&&p.edi<2).length} profiles</span> — extreme compound risk</div>
            </div>
          </div>
        </SectionCard>

        {/* Section 36: Cognitive Risk Intelligence Matrix */}
        <SectionCard number="36" title="🧬 Cognitive Risk Intelligence Matrix — 500-Profile Scatter Field">
          <p className="text-white/50 text-sm mb-4">Each dot represents one profile. X-axis: Pattern Mastery (PM). Y-axis: Emotional Magnitude (EM). The upper-right quadrant is the Crisis Zone — high cognitive power combined with uncontrolled emotional override.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Visionary Leaders', desc: 'High PM, Low EM', color: '#82B89A' },
              { label: 'Crisis Zone', desc: 'High PM + High EM', color: '#DC2626' },
              { label: 'Passive Followers', desc: 'Low PM, Low EM', color: '#7B9FC7' },
              { label: 'Reactive Drivers', desc: 'Low PM, High EM', color: '#fb923c' },
            ].map(q => (
              <div key={q.label} className="rounded-lg p-3" style={{ background: `${q.color}18`, border: `1px solid ${q.color}40` }}>
                <div className="text-xs font-bold mb-1" style={{ color: q.color }}>{q.label}</div>
                <div className="text-white/40 text-xs">{q.desc}</div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={440}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="x" type="number" domain={[1, 10]} label={{ value: 'Pattern Mastery (PM)', position: 'insideBottom', offset: -10, fill: AXIS_COLOR, fontSize: 11 }} tick={{ fill: AXIS_COLOR, fontSize: 10 }} />
              <YAxis dataKey="y" type="number" domain={[1, 10]} label={{ value: 'Emotional Magnitude (EM)', angle: -90, position: 'insideLeft', offset: 10, fill: AXIS_COLOR, fontSize: 11 }} tick={{ fill: AXIS_COLOR, fontSize: 10 }} />
              <ZAxis dataKey="z" range={[20, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                data={DEMO_PROFILES.map(p => ({
                  x: p.pm,
                  y: p.em,
                  z: p.alertLevel === 'critical' ? 80 : p.alertLevel === 'alert' ? 50 : 25,
                  label: `${p.name} (${p.role})`,
                  fill: p.alertLevel === 'critical' ? '#DC2626' : p.alertLevel === 'alert' ? '#fb923c' : p.alertLevel === 'caution' ? '#facc15' : '#82B89A',
                }))}
                shape={(props: any) => {
                  const { cx, cy, payload } = props;
                  const c = payload.fill;
                  const r = payload.alertLevel === 'critical' ? 6 : payload.alertLevel === 'alert' ? 4 : 3;
                  return <circle cx={cx} cy={cy} r={r} fill={c} fillOpacity={0.7} stroke={c} strokeWidth={payload.alertLevel === 'critical' ? 1 : 0} />;
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {[['#82B89A','Normal — Safe Zone'],['#facc15','Caution'],['#fb923c','Alert'],['#DC2626','CRITICAL — Risk Zone']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-2">
                <div className="rounded-full" style={{ width: 10, height: 10, background: c }} />
                <span className="text-xs text-white/50">{l}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl p-5" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)' }}>
            <div className="font-bold mb-3" style={{ color: '#fca5a5' }}>🚨 Crisis Zone Analysis — Upper Right Quadrant (PM &gt; 6 AND EM &gt; 7)</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-2xl font-black" style={{ color: '#DC2626' }}>{DEMO_PROFILES.filter(p=>p.pm>6&&p.em>7).length}</div>
                <div className="text-white/50 text-xs">Profiles in the Crisis Zone</div>
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: '#fb923c' }}>{Math.round(DEMO_PROFILES.filter(p=>p.pm>6&&p.em>7).length/500*100)}%</div>
                <div className="text-white/50 text-xs">of all profiles showing compound cognitive risk</div>
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: GOLD }}>3.8x</div>
                <div className="text-white/50 text-xs">higher decision failure rate in Crisis Zone vs. Visionary Leader quadrant</div>
              </div>
            </div>
          </div>
        </SectionCard>

