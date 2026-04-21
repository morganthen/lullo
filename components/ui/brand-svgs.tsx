// Decorative SVG illustrations from the Lullo design system

export function MoonSvg({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path
        d="M55 16 C38 16 24 30 24 47 C24 64 38 77 55 77 C42 77 31 66 31 50 C31 34 42 21 55 16Z"
        fill="#E8A882"
        opacity="0.55"
      />
      <circle cx="62" cy="22" r="3" fill="#E8A882" opacity="0.4" />
      <circle cx="20" cy="18" r="2" fill="#E8A882" opacity="0.3" />
    </svg>
  );
}

export function StarSvg({
  size = 12,
  opacity = 0.4,
  style,
}: {
  size?: number;
  opacity?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      style={style}
    >
      <path
        d="M6 1L7.2 4.8H11L7.9 7.2L9.1 11L6 8.6L2.9 11L4.1 7.2L1 4.8H4.8L6 1Z"
        fill="#E8A882"
        opacity={opacity}
      />
    </svg>
  );
}

export function CloudSvg({
  size = 60,
  opacity = 0.3,
}: {
  size?: number;
  opacity?: number;
}) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 60 36" fill="none">
      <ellipse cx="24" cy="24" rx="18" ry="13" fill="#E8A882" opacity={opacity} />
      <ellipse cx="40" cy="26" rx="16" ry="11" fill="#E8A882" opacity={opacity} />
      <ellipse cx="32" cy="20" rx="14" ry="10" fill="#E8A882" opacity={opacity} />
    </svg>
  );
}

export function BookStackSvg({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 90 100" fill="none">
      <rect x="5" y="72" width="80" height="18" rx="3" fill="#7A9E7E" opacity="0.45" />
      <rect x="5" y="72" width="8" height="18" rx="2" fill="#7A9E7E" opacity="0.7" />
      <rect x="10" y="50" width="68" height="18" rx="3" fill="#E8A882" opacity="0.5" />
      <rect x="10" y="50" width="8" height="18" rx="2" fill="#C4663A" opacity="0.55" />
      <rect x="14" y="30" width="60" height="16" rx="3" fill="#F5E8DF" opacity="0.8" />
      <rect x="14" y="30" width="7" height="16" rx="2" fill="#C4663A" opacity="0.4" />
      <rect x="26" y="35" width="30" height="2" rx="1" fill="#7A5C4A" opacity="0.18" />
      <rect x="26" y="40" width="20" height="2" rx="1" fill="#7A5C4A" opacity="0.14" />
    </svg>
  );
}

export function SleepingCharacterSvg() {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
      {/* Shelf */}
      <rect x="10" y="148" width="160" height="8" rx="3" fill="#7A5C4A" opacity="0.25" />
      {/* Body */}
      <ellipse cx="90" cy="118" rx="42" ry="26" fill="#F5E8DF" opacity="0.9" />
      {/* Head */}
      <circle cx="58" cy="105" r="24" fill="#F0D5C4" />
      {/* Ear */}
      <ellipse cx="57" cy="84" rx="8" ry="6" fill="#F0D5C4" />
      {/* Closed eyes */}
      <path d="M50 106 Q54 102 58 106" stroke="#7A5C4A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M62 104 Q66 100 70 104" stroke="#7A5C4A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Cheek */}
      <circle cx="52" cy="109" r="4" fill="#E8A882" opacity="0.3" />
      {/* Nightcap */}
      <path d="M40 97 Q55 60 75 85 L45 95Z" fill="#C4663A" opacity="0.6" />
      <circle cx="74" cy="86" r="4" fill="#F5E8DF" />
      {/* Zs */}
      <text x="86" y="88" fontFamily="DM Sans, sans-serif" fontSize="14" fill="#C4663A" opacity="0.5" fontWeight="300">z</text>
      <text x="100" y="74" fontFamily="DM Sans, sans-serif" fontSize="10" fill="#C4663A" opacity="0.35" fontWeight="300">z</text>
      <text x="112" y="62" fontFamily="DM Sans, sans-serif" fontSize="7" fill="#C4663A" opacity="0.25" fontWeight="300">z</text>
      {/* Faint shelf books */}
      <rect x="110" y="112" width="16" height="33" rx="2" fill="#7A5C4A" opacity="0.08" stroke="#7A5C4A" strokeWidth="0.5" strokeOpacity="0.15" />
      <rect x="130" y="116" width="13" height="29" rx="2" fill="#7A5C4A" opacity="0.06" stroke="#7A5C4A" strokeWidth="0.5" strokeOpacity="0.1" />
    </svg>
  );
}

export function OpenBookSvg() {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
      <path d="M80 20 Q50 16 12 24 L12 100 Q50 92 80 96Z" fill="#F5E8DF" />
      <path d="M80 20 Q50 16 12 24 L12 100 Q50 92 80 96Z" stroke="#C4663A" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
      <path d="M80 20 Q110 16 148 24 L148 100 Q110 92 80 96Z" fill="white" />
      <path d="M80 20 Q110 16 148 24 L148 100 Q110 92 80 96Z" stroke="#C4663A" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
      <line x1="80" y1="20" x2="80" y2="96" stroke="#7A5C4A" strokeWidth="1.5" strokeOpacity="0.3" />
      <line x1="28" y1="44" x2="68" y2="42" stroke="#7A5C4A" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      <line x1="28" y1="54" x2="72" y2="52" stroke="#7A5C4A" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      <line x1="28" y1="64" x2="65" y2="62" stroke="#7A5C4A" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      <line x1="28" y1="74" x2="60" y2="73" stroke="#7A5C4A" strokeWidth="1.5" strokeOpacity="0.1" strokeLinecap="round" />
      <line x1="92" y1="44" x2="132" y2="42" stroke="#7A5C4A" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      <line x1="92" y1="54" x2="136" y2="52" stroke="#7A5C4A" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      <line x1="92" y1="64" x2="130" y2="62" stroke="#7A5C4A" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
    </svg>
  );
}
