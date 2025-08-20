import React from "react";

const SubmitLoader = () => {
  return (
    <div className="h-full w-full flex flex-col gap-3 p-5">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 p-3 rounded-xl bg-[#212121]/70 animate-pulse"
        >
          {/* Profile circle */}
          <div className="h-8 w-8 rounded-full bg-gray-700"></div>

          {/* Title bar */}
          <div className="flex-1">
            <div className="h-3 w-32 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 w-20 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmitLoader;
