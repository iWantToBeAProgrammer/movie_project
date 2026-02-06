// src/components/TicketTemplates/Shared.jsx
export const BarcodeSvg = () => (
  <svg
    width="30"
    height="120"
    viewBox="0 0 40 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0" y="0" width="4" height="160" fill="white" />
    <rect x="6" y="0" width="2" height="160" fill="white" />
    <rect x="10" y="0" width="5" height="160" fill="white" />
    <rect x="18" y="0" width="3" height="160" fill="white" />
    <rect x="24" y="0" width="6" height="160" fill="white" />
    <rect x="36" y="0" width="4" height="160" fill="white" />
  </svg>
);

export const SkylineDividerSvg = ({ color }) => (
  <svg
    width="40"
    height="15"
    viewBox="0 0 60 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <path
      d="M2 18H58M2 18V12H6V8H10V14H14V6H18V16H22V10H26V18H30V8H34V18M58 18V14H54V18"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

export const StarSvg = ({ color = "#FFD700" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

// Ikon Gunting (Untuk Vintage Theme)
export const ScissorSvg = ({ color = "#000" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

export const SkullSvg = ({ color = "white" }) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C15.31 4 18 6.69 18 10C18 12.5 16.5 14.65 14.35 15.61C14.13 16.5 13.57 17.26 12.83 17.78C12.58 17.95 12.29 18.04 12 18.04C11.71 18.04 11.42 17.95 11.17 17.78C10.43 17.26 9.87 16.5 9.65 15.61C7.5 14.65 6 12.5 6 10C6 6.69 8.69 4 12 4ZM9 9C8.45 9 8 9.45 8 10C8 10.55 8.45 11 9 11C9.55 11 10 10.55 10 10C10 9.45 9.55 9 9 9ZM15 9C14.45 9 14 9.45 14 10C14 10.55 14.45 11 15 11C15.55 11 16 10.55 16 10C16 9.45 15.55 9 15 9Z" />
  </svg>
);

export const SimpleBloodSvg = ({ color = "#8a0303" }) => (
  <svg
    width="100%"
    height="40"
    viewBox="0 0 100 40"
    preserveAspectRatio="none"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0H100V10C90 25 80 5 70 15C60 25 50 10 40 20C30 30 20 5 10 15C5 20 0 10 0 0Z" />
  </svg>
);

export const SimpleWebSvg = ({ color = "#8a0303" }) => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    stroke={color}
    strokeWidth="2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="100" y1="100" x2="0" y2="0" />
    <line x1="100" y1="100" x2="50" y2="0" />
    <line x1="100" y1="100" x2="100" y2="0" />
    <line x1="100" y1="100" x2="0" y2="50" />
    <path d="M70 30 L100 20" />
    <path d="M40 40 L60 20" />
    <path d="M20 60 L40 40" />
    <path d="M80 80 L100 60" />
  </svg>
);

export const GrungeTextureSvg = ({ color = "white" }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 200 100"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="2" />
    <circle cx="50" cy="80" r="1.5" />
    <circle cx="150" cy="30" r="3" />
    <circle cx="180" cy="90" r="2" />
    <path d="M100 50 L120 60 L110 40 Z" />
    <path d="M40 40 L60 45" stroke={color} strokeWidth="1" />
  </svg>
);

// ============================================
// TAMBAHKAN DI FILE: components/tickets/Shared.jsx
// ============================================

export const VintageStampSvg = ({ color = "#4A3B2A" }) => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Lingkaran Luar Putus-putus */}
    <circle
      cx="40"
      cy="40"
      r="35"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="4 4"
    />

    {/* Lingkaran Dalam Solid */}
    <circle cx="40" cy="40" r="25" stroke={color} strokeWidth="1" />

    {/* Bintang di Tengah (Pengganti Teks) */}
    <path
      d="M40 25L44 35H55L46 42L50 53L40 46L30 53L34 42L25 35H36L40 25Z"
      fill={color}
      opacity="0.8"
    />
  </svg>
);

// Film Strip (Aman)
export const FilmStripSvg = ({ color = "#4A3B2A" }) => (
  <svg
    width="100%"
    height="20"
    viewBox="0 0 200 20"
    fill={color}
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="200" height="4" />
    <rect width="200" height="4" y="16" />
    {[...Array(20)].map((_, i) => (
      <rect key={i} x={i * 10 + 2} y="6" width="6" height="8" />
    ))}
  </svg>
);

// Ornament Sudut (Aman)
export const OrnamentSvg = ({ color = "#D4A574" }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0 Q20 5 20 20 L0 0Z" />
    <path d="M0 0 Q5 20 20 20 L0 0Z" />
    <circle cx="15" cy="15" r="2" />
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="22" cy="22" r="1" />
  </svg>
);

// Paper Texture (Aman)
export const PaperTextureSvg = ({ color = "#4A3B2A" }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 200 200"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="30" r="1.5" opacity="0.2" />
    <circle cx="60" cy="80" r="1" opacity="0.15" />
    <circle cx="140" cy="50" r="2" opacity="0.1" />
    <circle cx="180" cy="120" r="1.5" opacity="0.2" />
    <circle cx="90" cy="150" r="1" opacity="0.15" />
    <circle cx="120" cy="90" r="1.5" opacity="0.1" />
    <path d="M30 60 L50 65" stroke={color} strokeWidth="0.5" opacity="0.1" />
    <path
      d="M100 100 L130 110"
      stroke={color}
      strokeWidth="0.5"
      opacity="0.15"
    />
    <path d="M160 40 L170 45" stroke={color} strokeWidth="0.5" opacity="0.1" />
  </svg>
);

// ... (BarcodeSvg, dll yang lama biarkan saja) ...

// BARU: Ikon Hati (Heart)
export const HeartSvg = ({ color = "#FF69B4" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// BARU: Ikon Pita (Bow) - Simbol Coquette
export const BowSvg = ({ color = "#FF69B4" }) => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 100 100"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M50 55 C60 55 70 45 80 40 C90 35 100 40 95 50 C90 60 80 65 70 60 L80 80 L65 75 L55 60 C55 60 55 60 50 60 C45 60 45 60 45 60 L35 75 L20 80 L30 60 C20 65 10 60 5 50 C0 40 10 35 20 40 C30 45 40 55 50 55 Z" />
    <circle cx="50" cy="55" r="5" fill="white" opacity="0.5" />
  </svg>
);

// BARU: Awan (Cloud)
export const CloudSvg = ({ color = "#E0F7FA" }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 100 50"
    preserveAspectRatio="none"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 40 C 0 40, 0 20, 20 20 C 20 10, 40 0, 50 10 C 60 0, 80 10, 80 20 C 100 20, 100 40, 90 40 Z" />
  </svg>
);

// BARU: Kilau (Sparkle)
export const SparkleSvg = ({ color = "#FFD700" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

// ... (Asset sebelumnya: BarcodeSvg, HeartSvg, BowSvg, dll biarkan saja) ...

// BARU: Polkadot Pattern (SVG Manual, Aman)
export const PolkadotPatternSvg = ({ color }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="2" fill={color} />
    <circle cx="30" cy="30" r="2" fill={color} />
    <circle cx="50" cy="10" r="2" fill={color} />
    <circle cx="70" cy="30" r="2" fill={color} />
    <circle cx="90" cy="10" r="2" fill={color} />

    <circle cx="10" cy="50" r="2" fill={color} />
    <circle cx="30" cy="70" r="2" fill={color} />
    <circle cx="50" cy="50" r="2" fill={color} />
    <circle cx="70" cy="70" r="2" fill={color} />
    <circle cx="90" cy="50" r="2" fill={color} />

    <circle cx="10" cy="90" r="2" fill={color} />
    <circle cx="50" cy="90" r="2" fill={color} />
    <circle cx="90" cy="90" r="2" fill={color} />
  </svg>
);

// BARU: Diagonal Stripes Pattern (SVG Manual, Aman)
export const DiagonalStripeSvg = ({ color }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="-20" y1="20" x2="20" y2="-20" stroke={color} strokeWidth="1" />
    <line x1="0" y1="40" x2="40" y2="0" stroke={color} strokeWidth="1" />
    <line x1="20" y1="60" x2="60" y2="0" stroke={color} strokeWidth="1" />
    <line x1="0" y1="80" x2="80" y2="0" stroke={color} strokeWidth="1" />
    <line x1="0" y1="120" x2="120" y2="0" stroke={color} strokeWidth="1" />
    <line x1="40" y1="120" x2="140" y2="20" stroke={color} strokeWidth="1" />
    <line x1="80" y1="120" x2="160" y2="40" stroke={color} strokeWidth="1" />
  </svg>
);
