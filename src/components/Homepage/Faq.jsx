"use client";

import React, { useState } from "react";
import { TbPointFilled } from "react-icons/tb";
import { MdArrowForwardIos } from "react-icons/md";

const Faq = () => {
  const [selectedFaq, setSelectedFaq] = useState(null);

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

  const handleFaqClick = (faqs) => {
    setSelectedFaq(faqs);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-12 font-sans_caption">
      <h1 className="text-6xl mb-4 text-center">frequently asked questions</h1>
      <div className="flex w-full h-[28rem] overflow-hidden justify-end relative items-center">
        <div className="flex flex-col w-fit p-6 bg-white absolute left-0 z-99 rounded-tl-2xl rounded-bl-2xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="cursor-pointer text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-red-200 transition-all"
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

        <div className="flex flex-col w-[34rem] h-[24rem] p-6 bg-primary text-white rounded-2xl">
          <div className="pl-20 py-4">
            {selectedFaq ? (
              <>
                <h2 className="text-lg font-semibold mb-4">
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
