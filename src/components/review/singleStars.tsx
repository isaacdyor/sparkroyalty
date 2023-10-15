import React from "react";
import { AiFillStar } from "react-icons/ai";

const SingleStarsComponent: React.FC<{
  stars: number;
}> = ({ stars }) => {
  return (
    <div className="flex items-center">
      <p className="mr-1">{stars}</p>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} style={{ width: "1.3em", height: "1.3em" }}>
          <AiFillStar
            className={
              index < stars
                ? "absolute text-blue-500"
                : "absolute text-gray-400"
            }
            style={{
              fontSize: "1.3em",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default SingleStarsComponent;
