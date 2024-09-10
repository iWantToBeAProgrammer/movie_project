"use client";

import { Minus } from "@phosphor-icons/react";

export default function Certification({ result }) {
  return (
    <>
      <div className="p-3 border border-neutral rounded-xl">
        {result === "" ? <Minus size={24} /> : result}
      </div>
    </>
  );
}
