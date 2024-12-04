"use client";

import { Minus } from "@phosphor-icons/react";

export default function Certification({ result }) {
  return (
    <>
      <div className="p-1 border lg:p-3 border-neutral rounded-xl">
        {result === "" ? <Minus size={20} /> : result}
      </div>
    </>
  );
}
