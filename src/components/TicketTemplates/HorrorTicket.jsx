// src/components/TicketTemplates/HorrorTicket.jsx

import {
  BarcodeSvg,
  SkullSvg,
  SimpleBloodSvg,
  SimpleWebSvg,
  GrungeTextureSvg,
} from "./Shared";

const colors = {
  bg: "#050505",
  cardBg: "#0a0a0a",
  accent: "#8a0303",
  text: "#e0e0e0",
};

const HorrorTicketRow = ({ movie, index }) => (
  <div
    style={{
      display: "flex",
      width: "100%",
      height: "340px", // ✅ FIXED: Kembali ke ukuran Compact HD
      backgroundColor: "#0a0a0a",
      borderRadius: "0px",
      overflow: "hidden",
      border: `3px solid ${colors.accent}`,
      boxShadow: "8px 8px 0px #3d0000", // Hard shadow biar garang & ringan
      position: "relative",
      marginBottom: "30px", // ✅ FIXED: Gap antar tiket
    }}
  >
    {/* DEKORASI 1: Darah di Atas */}
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "50px",
        zIndex: 2,
      }}
    >
      <SimpleBloodSvg color={colors.accent} />
    </div>

    {/* DEKORASI 2: Jaring di Pojok Kanan Bawah */}
    <div
      style={{
        display: "flex",
        position: "absolute",
        bottom: -10,
        right: -10,
        width: "100px",
        height: "100px",
        opacity: 0.6,
        zIndex: 2,
      }}
    >
      <SimpleWebSvg color={colors.text} />
    </div>

    {/* DEKORASI 3: Tekstur Bercak */}
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0.1,
        zIndex: 0,
      }}
    >
      <GrungeTextureSvg color="#333" />
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
        color: colors.accent,
        opacity: 0.15,
        zIndex: 0,
        fontFamily: "sans-serif",
      }}
    >
      {index + 1}
    </div>

    {/* Poster Section */}
    <div
      style={{
        display: "flex",
        padding: "35px 20px 20px 20px", // Padding disesuaikan biar gak ketutup darah
        alignItems: "center",
        zIndex: 1,
        position: "relative",
      }}
    >
      <img
        src={movie.posterUrl}
        alt="poster"
        style={{
          width: "195px", // ✅ FIXED: Ukuran Poster Standar
          height: "285px", // ✅ FIXED
          objectFit: "cover",
          border: `2px solid ${colors.text}`,
        }}
      />
      {/* Overlay Merah Ringan (Div Transparan) */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 35,
          left: 20,
          width: "195px",
          height: "285px",
          backgroundColor: "#500000",
          opacity: 0.2,
        }}
      />
    </div>

    {/* Info Section */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "30px 10px 20px 10px",
        justifyContent: "center",
        zIndex: 1,
        position: "relative",
        minWidth: 0, // ✅ PENTING: Biar text truncate jalan
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "block", // ✅ WAJIB BLOCK buat ellipsis
          fontSize: "50px",
          fontWeight: 900,
          color: colors.accent,
          marginBottom: 10,
          lineHeight: 1,
          textTransform: "uppercase",
          textShadow: "3px 3px 0px black",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {movie.title || "SCREAM"}
      </div>

      {/* Year & Icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          marginBottom: 15,
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#111",
            border: `1px solid ${colors.accent}`,
            color: colors.accent,
            padding: "4px 15px",
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          {new Date().getFullYear()}
        </div>
        <div style={{ display: "flex", transform: "scale(1.4)" }}>
          <SkullSvg color={colors.text} />
        </div>
      </div>

      {/* Warning Text */}
      <div
        style={{
          display: "flex",
          color: "#666",
          fontSize: 22,
          fontFamily: "monospace",
          fontWeight: "bold",
          borderBottom: `2px solid ${colors.accent}`,
          paddingBottom: "5px",
          width: "100%",
          letterSpacing: "2px",
        }}
      >
        DO NOT ENTER
      </div>
    </div>

    {/* Barcode Section */}
    <div
      style={{
        display: "flex",
        borderLeft: `2px solid ${colors.accent}`,
        height: "100%",
        alignItems: "center",
        padding: "0 20px",
        flexDirection: "column",
        justifyContent: "center",
        gap: 20,
        zIndex: 1,
        position: "relative",
        backgroundColor: "#000",
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
        DEATH-{String(movie.id).padStart(4, "0").slice(0, 4)}
      </div>

      <div
        style={{
          display: "flex",
          backgroundColor: colors.accent,
          padding: "5px",
        }}
      >
        <BarcodeSvg />
      </div>
    </div>
  </div>
);

export const HorrorTicket = ({ movies }) => {
  // Pastikan cuma 4 movie
  const displayMovies = movies.slice(0, 4);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%", // ✅ FIXED: Ikut ukuran canvas (1920px)
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: "sans-serif",
        padding: "50px 40px",
        alignItems: "center",
        // Logic justify: Kalau kurang dari 4, tengah. Kalau 4, mulai dari atas.
        justifyContent: displayMovies.length < 4 ? "center" : "flex-start",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 40,
          position: "relative",
          width: "100%",
        }}
      >
        <h1
          style={{
            display: "flex",
            fontSize: 90,
            fontWeight: 900,
            margin: 0,
            color: colors.accent,
            letterSpacing: "6px",
            textShadow: "4px 4px 0px #220000",
            zIndex: 1,
          }}
        >
          WATCHLIST
        </h1>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.5em",
            color: "#000",
            fontWeight: "bold",
            backgroundColor: colors.accent,
            padding: "0 20px",
            marginTop: 10,
          }}
        >
          DIE HARD FAN
        </div>
      </div>

      {/* Movie Rows */}
      {displayMovies.map((movie, index) => (
        <HorrorTicketRow key={movie.id} movie={movie} index={index} />
      ))}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          alignItems: "center",
          justifyContent: "center",
          placeItems: "center",
          gap: 15,
          opacity: 0.6,
          color: colors.accent,
        }}
      >
        <div style={{ display: "flex", width: "45px", height: "45px" }}>
          <SkullSvg color={colors.accent} />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 35,
            fontWeight: 700,
          }}
        >
          NO ESCAPE • CINEMATIX
        </div>
        <div style={{ display: "flex", width: "45px", height: "45px" }}>
          <SkullSvg color={colors.accent} />
        </div>
      </div>
    </div>
  );
};
