import { BarcodeSvg, StarSvg } from "./Shared";

const colors = {
  bg: "#FFF0F5",
  cardBg: "#ffffff",
  accent: "#FF69B4",
  border: "#FFB6C1",
  text: "#FF1493",
};

const CuteTicketRow = ({ movie, index }) => (
  <div
    style={{
      display: "flex",
      width: "100%",
      height: "340px", // FIXED
      backgroundColor: colors.cardBg,
      borderRadius: "40px",
      overflow: "hidden",
      border: `4px solid ${colors.border}`,
      boxShadow: "0 10px 20px rgba(255, 182, 193, 0.4)",
      position: "relative",
    }}
  >
    {/* Watermark Number */}
    <div
      style={{
        display: "flex",
        position: "absolute",
        right: -10,
        bottom: -50,
        fontSize: 255, // FIXED
        fontWeight: 900,
        color: colors.accent,
        opacity: 0.1,
        zIndex: 0,
      }}
    >
      {index + 1}
    </div>

    {/* Poster */}
    <div
      style={{
        display: "flex",
        padding: "20px",
        alignItems: "center",
        zIndex: 1,
        position: "relative",
      }}
    >
      <img
        src={movie.posterUrl}
        style={{
          width: "195px", // FIXED
          height: "285px", // FIXED
          objectFit: "cover",
          borderRadius: "25px",
          border: `3px solid ${colors.border}`,
        }}
      />
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
        minWidth: 0, // PENTING
      }}
    >
      <div
        style={{
          display: "block",
          fontSize: "50px", // FIXED
          fontWeight: 900,
          color: colors.text,
          marginBottom: 10,
          lineHeight: 1.1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {movie.title || "CUTE MOVIE"}
      </div>

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
            backgroundColor: colors.accent,
            color: "white",
            padding: "5px 15px",
            borderRadius: 20,
            fontWeight: 700,
            fontSize: 20, // FIXED
          }}
        >
          {new Date().getFullYear()}
        </div>
        <StarSvg color={colors.accent} />
        <StarSvg color={colors.border} />
      </div>

      <div
        style={{
          display: "flex",
          color: "#FF99C8",
          fontSize: 20,
          fontWeight: "900",
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

      <div style={{ display: "flex", opacity: 0.6 }}>
        <BarcodeSvg />
      </div>
    </div>
  </div>
);

export const CuteTicket = ({ movies }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: colors.bg,
      color: colors.text,
      fontFamily: "sans-serif",
      padding: "50px 40px",
      gap: "30px",
      alignItems: "center",
      justifyContent: movies.length < 4 ? "center" : "flex-start",
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <h1
        style={{
          fontSize: 80,
          fontWeight: 900,
          margin: 0,
          color: colors.text,
          textShadow: "3px 3px 0px white",
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
          padding: "5px 20px",
          borderRadius: "20px",
        }}
      >
        WATCHLIST
      </div>
    </div>

    {movies.map((movie, index) => (
      <CuteTicketRow key={movie.id} movie={movie} index={index} />
    ))}

    <div
      style={{
        display: "flex",
        marginTop: "auto",
        alignItems: "center",
        gap: 15,
        opacity: 0.8,
        color: colors.accent,
      }}
    >
      <div style={{ display: "flex", fontSize: 24, fontWeight: 800 }}>
        💖 MADE WITH LOVE
      </div>
    </div>
  </div>
);
