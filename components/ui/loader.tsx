import React from "react";

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-4">
      <svg
        className="animate-spin h-5 w-5 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <span className="ml-2 text-sm font-medium text-gray-500">{message}</span>
    </div>
  );
};
