import Image from "next/image";
import React from "react";

const PrintDesc = () => {
  const templates = [
    {
      id: 1,
      name: "The Minimalist",
      src: "/assets/images/CinemaTix-modern-1770566858462.png",
      color: "bg-slate-800",
    },
    {
      id: 2,
      name: "Retro VHS",
      src: "/assets/images/CinemaTix-vintage-1770566907054.png",
      color: "bg-primary",
    },
    {
      id: 3,
      name: "Cyberpunk",
      src: "/assets/images/CinemaTix-cyber-1770566834403.png",
      color: "bg-secondary",
    },
    {
      id: 4,
      name: "Cutie",
      src: "/assets/images/CinemaTix-cute-1770566888785.png",
      color: "bg-white",
    },
  ];

  return (
    <div className="flex flex-col gap-16 px-4 md:gap-32 md:px-0">
      <div className="top-content flex flex-col items-center gap-8 font-raleway lg:flex-row lg:gap-16">
        <div className="print-image w-full lg:w-1/2">
          <Image
            src={"/assets/images/print-2.png"}
            width={1080}
            height={1080}
            quality={100}
            alt="print-image"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-auto w-full rounded-xl object-cover shadow-2xl"
          />
        </div>

        <div className="desc-print w-full text-center lg:w-1/2 lg:text-left">
          <h1 className="mb-2 font-bebas_neue text-5xl leading-none tracking-wide md:text-7xl">
            WATCHLIST GOES <span className="text-secondary">IRL</span> ✨
          </h1>
          <p className="text-2xl font-bold text-primary italic md:text-4xl">
            Touch Grass? Take Your List With You. 🌿
          </p>
          <p className="mt-6 text-base leading-relaxed text-gray-300 md:mt-10 md:text-xl">
            Screen fatigue is real, bestie. Ghost the blue light and print your
            movie lineup directly from the site. No cap, it’s giving
            <i> aesthetic organizer</i> energy. Stay organized and never miss a
            film drop!
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-10">
        <div className="text-center">
          <h2 className="font-bebas_neue text-4xl tracking-wider text-white md:text-6xl">
            CHOOSE YOUR <span className="text-primary">FIGHTER</span> 🎨
          </h2>
          <p className="mt-2 text-sm text-gray-400 md:text-lg">
            From clean minimalist to chaotic retro. Pick a mood that matches
            your list.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {templates.map((template, index) => (
            <div
              key={template.id}
              className={`group relative flex flex-col gap-3 transition-all duration-500 hover:-translate-y-2 ${
                index % 2 !== 0 ? "lg:mt-12" : "lg:mt-0"
              }`}
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-1 group-hover:shadow-primary/20">
                <div
                  className={`aspect-[9/16] w-full ${template.color} relative`}
                >
                  <Image
                    src={template.src}
                    alt={template.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    quality={90}
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black shadow-lg">
                      Preview
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-center font-bebas_neue text-xl tracking-wide text-gray-400 transition-colors group-hover:text-white md:text-2xl">
                {template.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bot-content flex flex-col items-center gap-8 font-raleway lg:flex-row lg:gap-16">
        <div className="desc-print order-2 w-full text-center lg:order-1 lg:w-1/2 lg:text-left">
          <p className="mb-6 text-3xl font-bold text-primary md:text-5xl">
            The Vibe Check ✅
          </p>
          <ul className="mt-5 flex flex-col gap-4 text-left text-base md:gap-6 md:text-xl">
            <li className="flex gap-3">
              <p className="text-secondary">✦</p>
              <p>
                <span className="font-bold text-white">
                  Main Character Energy:
                </span>{" "}
                Carry your list like an accessory. Perfect for flexing your
                elite taste to friends IRL.
              </p>
            </li>
            <li className="flex gap-3">
              <p className="text-secondary">✦</p>
              <p>
                <span className="font-bold text-white">
                  High-Key Organized:
                </span>{" "}
                Titles, genres, dates—all laid out cleanly. No doomscrolling,
                just picking.
              </p>
            </li>
            <li className="flex gap-3">
              <p className="text-secondary">✦</p>
              <p>
                <span className="font-bold text-white">Keep the Receipts:</span>{" "}
                Add the fresh drops, hit print, and keep your physical archive.
                <i> Very demure, very mindful.</i>
              </p>
            </li>
          </ul>
        </div>

        <div className="print-image order-1 flex w-full justify-center lg:order-2 lg:w-1/2 lg:justify-end">
          <div className="relative aspect-[9/16] w-3/4 max-w-sm rotate-3 rounded-2xl border-4 border-white/10 bg-gray-900 shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-0 hover:shadow-primary/20 md:w-2/3 lg:w-3/5">
            <Image
              src={"/assets/images/CinemaTix-horror-1770566943341.png"}
              alt="print-image"
              fill
              quality={95}
              sizes="(max-width: 768px) 75vw, 33vw"
              className="rounded-xl object-cover"
            />

            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 to-transparent opacity-50 mix-blend-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintDesc;
