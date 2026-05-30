export function BrandLogo() {
  return (
    <svg className="mark" viewBox="0 0 120 120" aria-label="TS보컬학원">
      <circle cx="60" cy="60" r="55" fill="#16261e" stroke="#c9a86a" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="48" fill="none" stroke="#c9a86a" strokeWidth=".75" opacity=".45" />
      <text
        x="60"
        y="68"
        textAnchor="middle"
        fontWeight="700"
        fontSize="46"
        fill="#c9a86a"
        letterSpacing="-1"
        style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
      >
        TS
      </text>
      <g stroke="#c9a86a" strokeWidth="2.6" strokeLinecap="round">
        <line x1="40" y1="89" x2="40" y2="84" />
        <line x1="47" y1="89" x2="47" y2="80" />
        <line x1="54" y1="89" x2="54" y2="74" />
        <line x1="60" y1="89" x2="60" y2="70" />
        <line x1="66" y1="89" x2="66" y2="74" />
        <line x1="73" y1="89" x2="73" y2="80" />
        <line x1="80" y1="89" x2="80" y2="84" />
      </g>
    </svg>
  );
}
