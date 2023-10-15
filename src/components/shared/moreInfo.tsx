import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const MoreInfo: React.FC<{ infoText: string; label: string }> = ({
  infoText,
  label,
}) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="z-10 mb-2 flex text-center">
      <label className="mr-2 block text-white">{label}</label>

      <div className="relative flex items-center justify-between">
        <div
          // className="absolute right-0 top-0 flex items-center"
          onMouseEnter={togglePopup}
          onMouseLeave={togglePopup}
        >
          <AiOutlineQuestionCircle className="cursor-pointer text-muted-foreground" />
        </div>
        {showPopup && (
          <div className="absolute left-5 z-20 w-44 rounded-lg border border-slate-600 bg-card px-1 py-3 text-sm">
            {infoText}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoreInfo;
