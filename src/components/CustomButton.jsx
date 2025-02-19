"use client";

import React from "react";
import { PlusCircle, Eye } from "@phosphor-icons/react";

const CustomButton = ({ type, size = "medium", className = "" }) => {
  const buttonConfig = {
    add: {
      text: "Add To Watchlist",
      icon: <PlusCircle size={20} className="inline-block mr-2" />,
      className: "bg-white text-black hover:bg-secondary hover:text-white",
    },
    watched: {
      text: "Watched It",
      icon: <Eye size={20} className="inline-block mr-2" />,
      className:
        "bg-transparent border border-secondary border-4 text-secondary hover:bg-secondary hover:text-white",
    },
  };

  const { text, icon, className: variantClassName } = buttonConfig[type] || {};

  const sizeClasses = {
    small: "py-1 w-10 text-sm",
    medium: "py-2 w-20 text-base",
    large: "py-1 w-52 text-2xl",
  };

  return (
    <button
      className={` rounded-lg transition-colors font-bebas_neue duration-200 flex items-center justify-center    ${variantClassName} ${sizeClasses[size]} ${className}`}
    >
      {icon}
      {text}
    </button>
  );
};

export default CustomButton;
