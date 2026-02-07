"use client";

import React, { useState } from "react";
import { TbPointFilled } from "react-icons/tb";
import { MdArrowForwardIos } from "react-icons/md";

const Faq = () => {
  const faqs = [
    {
      question: "What's the lore behind CINEMATix? 🎬",
      answer:
        "CINEMATix is your ultimate movie hub, bestie. We spill the tea on trailers, show you where to stream legally (no sketchy sites here), and let you print your watchlist so you can touch grass while staying organized.",
    },
    {
      question: "Do I need to pay? 💸",
      answer:
        "It's free real estate! You can browse and build lists for $0. But heads up, the streaming platforms we link to (like Netflix or Disney+) might need a sub. We just show you the way.",
    },
    {
      question: "Source? Trust me bro? 🤨",
      answer:
        "Nah, we got receipts. We pull data from the GOATs like TMDB (The Movie Database). So the info is legit, fresh, and accurate. No cap.",
    },
    {
      question: "Where to watch without going to jail? 🚔",
      answer:
        "We only stan legal streaming. Every movie page lists the official platforms where you can rent, buy, or subscribe. Keep it clean, keep it safe.",
    },
    {
      question: "How to gatekeep my movies? 📝",
      answer:
        "Easy. Hit that 'Add to Watchlist' button. Once you're done curating your main character era movie list, you can print it out and flex it IRL.",
    },
  ];

  const [selectedFaq, setSelectedFaq] = useState(faqs[0]);
  const handleFaqClick = (faq) => {
    setSelectedFaq(faq);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-12 md:px-0">
      <h1 className="mb-8 text-center font-bebas_neue text-5xl tracking-wide md:mb-12 md:text-7xl">
        THE 411 (FAQs) ✨
      </h1>

      {/* Container Utama: Flex column di mobile, Relative block di desktop untuk overlap effect */}
      <div className="relative flex w-full max-w-6xl flex-col lg:block">
        {/* --- LEFT SIDE (QUESTIONS) --- */}
        {/* Mobile: Full width, stacked top. Desktop: Absolute left, overlapping */}
        <div className="z-20 w-full lg:absolute lg:top-1/2 lg:left-0 lg:w-[40%] lg:-translate-y-1/2">
          <div className="flex flex-col rounded-2xl bg-white p-4 shadow-xl lg:rounded-l-2xl lg:rounded-r-none lg:p-6">
            <div className="space-y-2 font-raleway font-bold md:space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 ${
                    selectedFaq.question === faq.question
                      ? "scale-[1.02] transform bg-primary text-white shadow-md"
                      : "text-gray-600 hover:bg-red-50"
                  }`}
                  onClick={() => handleFaqClick(faq)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <TbPointFilled
                        className={
                          selectedFaq.question === faq.question
                            ? "text-secondary"
                            : "text-gray-400"
                        }
                      />
                      <p className="line-clamp-1 text-sm md:text-base">
                        {faq.question}
                      </p>
                    </div>
                    <MdArrowForwardIos size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE (ANSWERS) --- */}
        {/* Mobile: Full width, stacked bottom. Desktop: Aligned right, fixed height */}
        <div className="mt-6 lg:mt-0 lg:ml-auto lg:w-[75%]">
          <div className="flex min-h-[16rem] flex-col justify-center rounded-2xl bg-primary p-6 text-white shadow-2xl transition-all md:min-h-[20rem] lg:h-[28rem]">
            {/* Padding kiri ditambah di desktop agar teks tidak ketutup box pertanyaan */}
            <div className="py-4 lg:pr-10 lg:pl-[25%]">
              {selectedFaq ? (
                <div className="animate-fadeIn">
                  <h2 className="mb-4 font-bebas_neue text-2xl tracking-wider text-secondary md:text-3xl">
                    {selectedFaq.question}
                  </h2>
                  <p className="font-raleway text-base leading-relaxed text-gray-200 md:text-xl">
                    {selectedFaq.answer}
                  </p>
                </div>
              ) : (
                <p className="font-raleway text-white/70">
                  Select a vibe check...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
