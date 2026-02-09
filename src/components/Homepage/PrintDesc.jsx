import Image from "next/image";
import React from "react";

const PrintDesc = () => {
  return (
    <div className="flex flex-col gap-12 px-4 md:gap-24 md:px-0">
      <div className="top-content flex flex-col items-center gap-8 font-raleway lg:flex-row lg:gap-16">
        <div className="print-image w-full lg:w-1/2">
          <Image
            src={"/assets/images/print-image-1.png"}
            width={1080}
            height={1080}
            alt="print-image"
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
            <i>aesthetic organizer</i> energy. Stay organized and never miss a
            film drop!
          </p>
        </div>
      </div>

      {/* SECTION 2: Text Left, Image Right */}
      <div className="bot-content flex flex-col items-center gap-8 font-raleway lg:flex-row lg:gap-16">
        {/* Text Wrapper */}
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
                <i>Very demure, very mindful.</i>
              </p>
            </li>
          </ul>
        </div>

        {/* Image Wrapper */}
        <div className="print-image order-1 flex w-full justify-center lg:order-2 lg:w-1/2 lg:justify-end">
          <Image
            src={"/assets/images/print-image-2.png"}
            width={400}
            height={760}
            alt="print-image"
            className="h-auto w-3/4 object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105 md:w-1/2 lg:w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PrintDesc;
