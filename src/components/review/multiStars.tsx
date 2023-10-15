import React from "react";
import { AiFillStar } from "react-icons/ai";
import { type ReviewType } from "~/types/types";

const MultiStarsComponent: React.FC<{
  reviews: ReviewType[];
}> = ({ reviews }) => {
  const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
  // const averageStars = reviews.length > 0 ? totalStars / reviews.length : 0;
  const averageStars = totalStars / reviews.length;

  const integerPart = Math.floor(averageStars);
  const fractionalPart = averageStars - integerPart;

  return (
    <div className="flex items-center">
      {reviews.length === 0 ? (
        <p className="mr-1 text-blue-500">No reviews yet</p>
      ) : (
        <>
          <p className="mr-1">{averageStars.toFixed(1)}</p>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} style={{ width: "1.3em", height: "1.3em" }}>
              <AiFillStar
                className={
                  index < integerPart
                    ? "absolute text-blue-500"
                    : index === integerPart && fractionalPart > 0
                    ? "absolute text-blue-500"
                    : "absolute text-gray-400"
                }
                style={{
                  fontSize: "1.3em",
                  zIndex: 1,
                  clipPath:
                    index === integerPart && fractionalPart > 0
                      ? `inset(0 ${(1 - fractionalPart) * 100}% 0 0)`
                      : "",
                }}
              />
              <AiFillStar
                className=" text-gray-400"
                style={{
                  fontSize: "1.3em",
                }}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default MultiStarsComponent;
