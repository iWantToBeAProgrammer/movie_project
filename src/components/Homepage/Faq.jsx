"use client";

import React, { useState } from "react";
import { TbPointFilled } from "react-icons/tb";
import { MdArrowForwardIos } from "react-icons/md";

const Faq = () => {
  const faqs = [
    {
      question: "What is CINEMATix?",
      answer:
        "CINEMATix is a platform that provides detailed information about movie trailers, where to watch movies legally, and a feature to create and print your personal watchlist.",
    },
    {
      question: "Is this service free?",
      answer:
        "Yes, you can use CINEMATix for free to search for movie information and create a watchlist. However, some streaming services listed on our website may require a subscription or payment.",
    },
    {
      question: "Where does the movie information come from?",
      answer:
        "We gather data from trusted sources, including popular movie databases, official streaming platforms, and movie distribution services from https://www.themoviedb.org/",
    },
    {
      question: "How can I find out where to watch a movie legally?",
      answer:
        "Each movie listed on CINEMATix includes information on official streaming platforms where it is available, whether for subscription, rental, or purchase.",
    },
    {
      question: "How do I create a watchlist?",
      answer:
        "You can add movies to your watchlist by clicking the Add to Watchlist button on the movie’s page. Your watchlist can be saved and printed for personal reference.",
    },
  ];

  const [selectedFaq, setSelectedFaq] = useState(faqs[0]);
  const handleFaqClick = (faq) => {
    setSelectedFaq(faq);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center py-12 font-sans_caption">
      <h1 className="mb-4 text-center text-6xl">frequently asked questions</h1>
      <div className="relative flex h-[28rem] w-full items-center justify-end overflow-hidden">
        <div className="absolute left-0 z-99 flex w-fit flex-col rounded-tl-2xl rounded-bl-2xl bg-white p-6">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded-lg px-4 py-2 transition-all ${
                  selectedFaq.question === faq.question
                    ? "bg-red-600 text-white"
                    : "text-gray-700 hover:bg-red-200"
                }`}
                onClick={() => handleFaqClick(faq)}
              >
                <div className="flex items-center justify-between gap-10">
                  <div className="flex items-center gap-2">
                    <TbPointFilled />
                    <p>{faq.question}</p>
                  </div>
                  <MdArrowForwardIos />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex h-[24rem] w-[34rem] flex-col rounded-2xl bg-primary p-6 text-white">
          <div className="py-4 pl-20">
            {selectedFaq ? (
              <>
                <h2 className="mb-4 text-lg font-semibold">
                  {selectedFaq.question}
                </h2>
                <p className="text-sm">{selectedFaq.answer}</p>
              </>
            ) : (
              <p className="text-white/70">Select a question</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
