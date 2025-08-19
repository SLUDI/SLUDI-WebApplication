import React from "react";

export default function ScoreIndicator({ score }) {
  const degree = (score / 100) * 360;

  return (
    <div className="relative w-32 h-32">
      <svg className="absolute top-0 left-0" viewBox="0 0 36 36">
        <path
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#eee"
          strokeWidth="2"
        />
        <path
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831"
          fill="none"
          stroke="#4ade80"
          strokeDasharray={`${score}, 100`}
          strokeWidth="2"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-green-600 text-xl font-bold">
        {score}%
      </div>
    </div>
  );
}
