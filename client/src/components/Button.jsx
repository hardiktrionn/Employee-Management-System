"use client";

import React from "react";

const Button = ({
  onClick,
  label,
  loading,
  loadLabel = "loading",
  color = true,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full shadow-xl py-2.5 px-4 text-sm font-semibold ${
        color
          ? "text-white bg-blue-600 hover:bg-blue-700"
          : "shadow-gray-200 border border-gray-300 text-black bg-white hover:bg-gray-100"
      } rounded-lg disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none cursor-pointer`}
    >
      {loading ? <p className="animate-pulse">{loadLabel}...</p> : label}
    </button>
  );
};

export default Button;
