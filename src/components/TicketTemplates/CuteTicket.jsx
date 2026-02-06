import {
  BarcodeSvg,
  HeartSvg,
  BowSvg,
  CloudSvg,
  SparkleSvg,
  PolkadotPatternSvg,
  DiagonalStripeSvg,
} from "./Shared";

const colors = {
  bg: "#FFF0F5", // Lavender Blush
  cardBg: "#ffffff",
  accent: "#FF69B4", // Hot Pink
  border: "#FFB6C1", // Light Pink
  text: "#FF1493", // Deep Pink
};

const CuteTicketRow = ({ movie, index }) => (
  <div
    style={{
      display: "flex",
      width: "100%",
      height: "340px",
      backgroundColor: colors.cardBg,
      borderRadius: "40px",
      overflow: "hidden",
      border: `4px solid ${colors.border}`,
      boxShadow: "0 10px 25px rgba(255, 105, 180, 0.3)",
      position: "relative",
      marginBottom: "30px", // Gap antar tiket
    }}
  >
    {/* DEKORASI: Polkadot Pattern (SVG Overlay) - AMAN */}
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0.3,
        zIndex: 0,
      }}
    >
      <PolkadotPatternSvg color={colors.border} />
    </div>

    {/* DEKORASI: Pita (Bow) */}
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: -5,
        right: -5,
        transform: "rotate(15deg)",
        zIndex: 2,
      }}
    >
      <BowSvg color={colors.accent} />
    </div>

    {/* DEKORASI: Awan di Bawah */}
    <div
      style={{
        display: "flex",
        position: "absolute",
        bottom: -20,
        left: 0,
        width: "100%",
        height: "60px",
        zIndex: 0,
        opacity: 0.5,
      }}
    >
      <CloudSvg color="#FFE4E1" />
    </div>

    {/* Watermark Number */}
    <div
      style={{
        display: "flex",
        position: "absolute",
        right: 10,
        bottom: -50,
        fontSize: 255,
        fontWeight: 900,
        color: colors.border,
        opacity: 0.2,
        zIndex: 0,
        fontFamily: "sans-serif",
      }}
    >
      {index + 1}
    </div>

    {/* Poster */}
    <div
      style={{
        display: "flex",
        padding: "20px 20px 20px 25px",
        alignItems: "center",
        zIndex: 1,
        position: "relative",
      }}
    >
      <img
        src={movie.posterUrl}
        style={{
          width: "195px",
          height: "285px",
          objectFit: "cover",
          borderRadius: "20px",
          // Ganti dashed dengan solid biar aman, atau dashed tapi simple
          borderWidth: "4px",
          borderStyle: "dashed",
          borderColor: colors.border,
          backgroundColor: "white",
        }}
      />
      {/* Stiker Hati */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 15,
          left: 15,
          transform: "rotate(-15deg)",
        }}
      >
        <HeartSvg color={colors.text} />
      </div>
    </div>

    {/* Info */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "20px 10px",
        justifyContent: "center",
        zIndex: 1,
        position: "relative",
        minWidth: 0,
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "block",
          fontSize: "50px",
          fontWeight: 900,
          color: colors.text,
          marginBottom: 10,
          lineHeight: 1.1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
          textShadow: "2px 2px 0px #FFF0F5",
        }}
      >
        {movie.title || "CUTE MOVIE"}
      </div>

      {/* Year & Decoration */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 15,
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "white",
            border: `2px solid ${colors.accent}`,
            color: colors.accent,
            padding: "5px 15px",
            borderRadius: 20,
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          {new Date().getFullYear()}
        </div>
        <div style={{ display: "flex", transform: "scale(1.2)" }}>
          <SparkleSvg color={colors.accent} />
        </div>
        <div style={{ display: "flex", transform: "scale(1.2) rotate(20deg)" }}>
          <HeartSvg color={colors.border} />
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          display: "flex",
          color: "#FF99C8",
          fontSize: 20,
          fontWeight: "900",
          backgroundColor: "#FFF0F5",
          padding: "5px 10px",
          borderRadius: "10px",
          alignSelf: "flex-start",
        }}
      >
        ★ LOVELY WATCH ★
      </div>
    </div>

    {/* Barcode Section */}
    <div
      style={{
        display: "flex",
        borderLeft: `3px dashed ${colors.border}`,
        height: "100%",
        alignItems: "center",
        padding: "0 20px",
        flexDirection: "column",
        justifyContent: "center",
        gap: 20,
        zIndex: 1,
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          transform: "rotate(90deg)",
          fontSize: 18,
          color: colors.accent,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        ID-{String(movie.id).slice(0, 6)}
      </div>

      <div style={{ display: "flex", opacity: 0.6, transform: "scale(1.1)" }}>
        <BarcodeSvg />
      </div>
    </div>
  </div>
);

export const CuteTicket = ({ movies }) => {
  const displayMovies = movies.slice(0, 4);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%", // Fit Canvas
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: "sans-serif",
        padding: "50px 40px",
        alignItems: "center",
        justifyContent: displayMovies.length < 4 ? "center" : "flex-start",
        // HAPUS background-image gradient yang bikin crash!
        // Gunakan warna solid saja di sini, atau SVG overlay
        position: "relative",
      }}
    >
      {/* Background Stripes Overlay (SVG) - AMAN */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.1, // Tipis aja
          zIndex: 0,
        }}
      >
        <DiagonalStripeSvg color={colors.accent} />
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 40,
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
      >
        {/* Dekorasi Awan di Header */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: -40,
            left: -60,
            width: "120px",
            height: "80px",
            opacity: 0.8,
          }}
        >
          <CloudSvg color="white" />
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: -20,
            right: -60,
            width: "100px",
            height: "60px",
            opacity: 0.8,
          }}
        >
          <CloudSvg color="white" />
        </div>

        <h1
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 900,
            margin: 0,
            color: colors.text,
            textShadow: "4px 4px 0px white",
            zIndex: 1,
          }}
        >
          MY DIARY
        </h1>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.2em",
            color: colors.accent,
            fontWeight: "900",
            backgroundColor: "white",
            padding: "5px 25px",
            borderRadius: "50px",
            marginTop: 10,
            boxShadow: "0 5px 0px #FFB6C1",
            zIndex: 1,
          }}
        >
          WATCHLIST
        </div>
      </div>

      {/* Movie Rows */}
      {displayMovies.map((movie, index) => (
        <div
          key={movie.id}
          style={{ display: "flex", width: "100%", zIndex: 1 }}
        >
          <CuteTicketRow movie={movie} index={index} />
        </div>
      ))}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          alignItems: "center",
          gap: 15,
          opacity: 1,
          color: colors.text,
          zIndex: 1,
        }}
      >
        <HeartSvg color={colors.accent} />
        <div style={{ display: "flex", fontSize: 24, fontWeight: 800 }}>
          💖 MADE WITH LOVE • CINEMATIX
        </div>
        <HeartSvg color={colors.accent} />
      </div>
    </div>
  );
};
