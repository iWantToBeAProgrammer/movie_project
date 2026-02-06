// src/components/TicketTemplates/index.js
import { ImageResponse } from "next/og";
import { CyberTicket } from "./CyberTicket";
import { CuteTicket } from "./CuteTicket";
import { VintageTicket } from "./VintageTicket";
import { HorrorTicket } from "./HorrorTicket";
import { ModernTicket } from "./ModernTicket";

export function generateTicketImage(theme, movies) {
  let element;
  let options = {
    width: 1080,
    height: 1920,
    // fonts: [] // Load font disini kalau mau
  };

  switch (theme) {
    case "cute":
      element = <CuteTicket movies={movies} />;
      break;
    case "vintage":
      element = <VintageTicket movies={movies} />;
      break;
    case "horror":
      element = <HorrorTicket movies={movies} />;
      break;
    case "modern":
      element = <ModernTicket movies={movies} />;
      break;
    case "cyber":
    default:
      element = <CyberTicket movies={movies} />;
      break;
  }

  return new ImageResponse(element, options);
}
