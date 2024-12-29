"use client";

import { CaretRight } from "@phosphor-icons/react";
import React from "react";

const Header = ({ title, linkHref }) => {
  return (
    <div className="flex items-center mb-4 text-2xl font-bebas_neue">
      <h1 className="w-40">{title}</h1>
      <a href={linkHref}>
        <CaretRight className="text-secondary" weight="bold" size={30} />
      </a>
    </div>
  );
};

export default Header;
