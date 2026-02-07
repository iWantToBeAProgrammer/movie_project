import { BarcodeSvg } from "./Shared";

const colors = {
  bg: "#F3F4F6",
  cardBg: "#ffffff",
  text: "#111827",
  muted: "#9CA3AF",
  accent: "#111827",
};

const ModernTicketRow = ({ movie, index }) => (
  <div
    style={{
      display: "flex",
      width: "100%",
      height: "340px", // FIXED
      backgroundColor: colors.cardBg,
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      position: "relative",
    }}
  >
    {/* Watermark Number */}
    <div
      style={{
        display: "flex",
        position: "absolute",
        right: -20,
        bottom: -50,
        fontSize: 255, // FIXED
        fontWeight: 900,
        color: "black",
        opacity: 0.03,
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
          borderRadius: "16px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
          fontWeight: 800,
          color: colors.text,
          marginBottom: 10,
          lineHeight: 1.1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {movie.title || "Movie Title"}
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
            backgroundColor: "#E5E7EB",
            color: "black",
            padding: "6px 16px",
            borderRadius: 50,
            fontWeight: 600,
            fontSize: 20, // FIXED
          }}
        >
          {new Date().getFullYear()}
        </div>
        <div
          style={{
            display: "flex",
            height: 6,
            width: 6,
            borderRadius: "50%",
            background: "black",
          }}
        ></div>
        <div style={{ display: "flex", fontSize: 20, color: colors.muted }}>
          HD Quality
        </div>
      </div>

      <div style={{ display: "flex", color: colors.muted, fontSize: 20 }}>
        Ticket confirmed
      </div>
    </div>

    {/* Barcode Section */}
    <div
      style={{
        display: "flex",
        borderLeft: "2px solid #E5E7EB",
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
          fontSize: 14,
          color: colors.muted,
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        #{String(movie.id).slice(0, 8)}
      </div>

      <div style={{ display: "flex" }}>
        <BarcodeSvg />
      </div>
    </div>
  </div>
);

export const ModernTicket = ({ movies }) => (
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
          letterSpacing: "-0.05em",
        }}
      >
        Watchlist.
      </h1>
      <div style={{ display: "flex", fontSize: 24, color: colors.muted }}>
        Your personal collection
      </div>
    </div>

    {movies.map((movie, index) => (
      <ModernTicketRow key={movie.id} movie={movie} index={index} />
    ))}

    <div
      style={{
        display: "flex",
        marginTop: "auto",
        alignItems: "center",
        gap: 10,
        opacity: 0.5,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 20,
          fontWeight: 600,
          color: colors.muted,
        }}
      >
        Powered by MovieList
      </div>
    </div>
  </div>
);
