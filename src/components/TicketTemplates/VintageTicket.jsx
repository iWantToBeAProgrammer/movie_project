import {
  BarcodeSvg,
  ScissorSvg,
  VintageStampSvg,
  FilmStripSvg,
  OrnamentSvg,
  PaperTextureSvg,
} from "./Shared";

const colors = {
  bg: "#E8DCC5",
  cardBg: "#F4EBD9",
  accent: "#4A3B2A", // Coklat Tua
  border: "#8B4513", // Coklat Tembaga
  sepia: "#D4A574",
};

const VintageTicketRow = ({ movie, index }) => {
  const truncateText = (text, maxLength) => {
    if (!text) return "No synopsis available.";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "340px",
        backgroundColor: colors.cardBg,
        borderRadius: "4px",
        overflow: "hidden",
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: colors.accent,
        position: "relative",
        marginBottom: "30px",
        boxShadow: "5px 5px 0px rgba(74, 59, 42, 0.2)",
      }}
    >
      {/* Texture Overlay */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.15,
          zIndex: 0,
        }}
      >
        <PaperTextureSvg color={colors.accent} />
      </div>

      {/* Film Strip Atas */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "20px",
          opacity: 0.3,
          zIndex: 0,
        }}
      >
        <FilmStripSvg color={colors.accent} />
      </div>

      {/* Vintage Stamp */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 10,
          right: 10,
          width: "80px",
          height: "80px",
          opacity: 0.3,
          transform: "rotate(15deg)",
          zIndex: 0,
        }}
      >
        <VintageStampSvg color={colors.border} />
      </div>

      {/* Watermark Number */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: -10,
          bottom: -50,
          fontSize: 255,
          fontWeight: 900,
          color: colors.accent,
          opacity: 0.08,
          fontFamily: "sans-serif",
          zIndex: 0,
        }}
      >
        {index + 1}
      </div>

      {/* --- POSTER --- */}
      <div
        style={{
          display: "flex",
          padding: "25px 20px 20px 20px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <img
          src={movie.posterUrl}
          alt="poster"
          style={{
            width: "195px",
            height: "285px",
            objectFit: "cover",
            // FIX: Ganti solid
            borderWidth: "5px",
            borderStyle: "solid",
            borderColor: colors.accent,
          }}
        />
        {/* Sepia Filter Overlay */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 25,
            left: 20,
            width: "195px",
            height: "285px",
            backgroundColor: colors.sepia,
            opacity: 0.2,
          }}
        />
      </div>

      {/* --- INFO --- */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "20px 10px",
          justifyContent: "center",
          position: "relative",
          minWidth: 0,
          zIndex: 1,
        }}
      >
        {/* Title */}
        <div
          style={{
            display: "block",
            fontSize: "50px",
            fontWeight: 900,
            color: colors.accent,
            marginBottom: 10,
            lineHeight: 1.1,
            textTransform: "uppercase",
            borderBottom: `3px solid ${colors.accent}`,
            paddingBottom: "8px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {movie.title || "CLASSIC TITLE"}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "18px",
            lineHeight: "1.4",
            color: colors.accent,
            opacity: 0.8,
            marginBottom: 3,
            height: "76px",
            overflow: "hidden",
          }}
        >
          {truncateText(movie.overview, 95)}
        </div>

        {/* Year */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <div
            style={{
              display: "flex",
              border: `2px solid ${colors.accent}`,
              color: colors.accent,
              padding: "4px 15px",
              fontSize: 20,
              fontWeight: "bold",
              marginRight: 15,
            }}
          >
            EST. {new Date().getFullYear()}
          </div>
          <div
            style={{
              display: "flex",
              height: 2,
              flex: 1,
              backgroundColor: colors.accent,
            }}
          />
        </div>

        {/* Footer Text */}
        <div
          style={{
            display: "flex",
            color: colors.accent,
            fontSize: 20,
            fontFamily: "monospace",
            letterSpacing: "1px",
            fontWeight: "bold",
          }}
        >
          ADMIT ONE • CINEMA
        </div>

        {/* Dots Decoration */}
        <div style={{ display: "flex", marginTop: 10 }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: colors.accent,
                marginRight: "8px",
                opacity: 0.4,
              }}
            />
          ))}
        </div>
      </div>

      {/* --- BARCODE --- */}
      <div
        style={{
          display: "flex",
          // FIX: Ganti solid
          borderLeft: `3px solid ${colors.accent}`,
          height: "100%",
          alignItems: "center",
          padding: "0 20px",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Scissor Icon */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: -14,
            top: 25,
            backgroundColor: colors.cardBg,
            padding: 2,
          }}
        >
          <ScissorSvg color={colors.accent} />
        </div>

        {/* Number Vertical */}
        <div
          style={{
            display: "flex",
            transform: "rotate(90deg)",
            fontSize: 18,
            fontWeight: 700,
            color: colors.accent,
            fontFamily: "monospace",
            marginBottom: 30,
            whiteSpace: "nowrap",
          }}
        >
          NO. {String(movie.id).padStart(6, "0").slice(0, 6)}
        </div>

        {/* Barcode */}
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
};

export const VintageTicket = ({ movies }) => {
  const displayMovies = movies.slice(0, 4);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        color: colors.accent,
        fontFamily: "sans-serif",
        padding: "50px 40px",
        alignItems: "center",
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
          width: "100%",
          position: "relative",
        }}
      >
        {/* Ornament Kiri */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            top: 0,
            width: "60px",
            height: "60px",
            opacity: 0.4,
          }}
        >
          <OrnamentSvg color={colors.sepia} />
        </div>

        {/* Ornament Kanan */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 0,
            top: 0,
            width: "60px",
            height: "60px",
            opacity: 0.4,
            transform: "scaleX(-1)",
          }}
        >
          <OrnamentSvg color={colors.sepia} />
        </div>

        <h1
          style={{
            display: "flex",
            fontSize: 70,
            fontWeight: 900,
            margin: 0,
            letterSpacing: "0.1em",
            textAlign: "center",
          }}
        >
          CINEMA TICKET
        </h1>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontStyle: "italic",
            marginTop: 5,
          }}
        >
          The Official Collection
        </div>

        {/* FIX: Ganti Double Border dengan 2 Garis Solid Manual */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            marginTop: 15,
            alignItems: "center",
          }}
        >
          {/* Garis Atas Tebal */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "3px",
              backgroundColor: colors.accent,
            }}
          />
          {/* Gap */}
          <div style={{ display: "flex", height: "3px" }} />
          {/* Garis Bawah Tipis */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "1px",
              backgroundColor: colors.accent,
            }}
          />
        </div>
      </div>

      {/* Movie Rows */}
      {displayMovies.map((movie, index) => (
        <VintageTicketRow key={movie.id} movie={movie} index={index} />
      ))}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          alignItems: "center",
          opacity: 0.7,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontFamily: "monospace",
            fontWeight: "bold",
          }}
        >
          ARCHIVE CINEMATIX NO. {Date.now().toString().slice(-6)}
        </div>
      </div>
    </div>
  );
};
