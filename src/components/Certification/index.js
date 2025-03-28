"use client";

import { Minus } from "@phosphor-icons/react";

export default function Certification({ result, borderColor = "neutral" }) {
  return (
    <>
      <div
        className={`p-1 border lg:p-3 border-${borderColor} rounded-xl font-bebas_neue`}
      >
        {result === "" ? <Minus size={20} /> : result}
      </div>
    </>
  );
}
