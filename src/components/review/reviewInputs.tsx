import React from "react";
import { AiFillStar } from "react-icons/ai";

interface EditReviewFormProps {
  review: string;
  stars: number;
  setReview: (newReview: string) => void;
  setStars: (newStars: number) => void;
}

const ReviewInputs: React.FC<EditReviewFormProps> = ({
  review,
  stars,
  setReview,
  setStars,
}) => {
  const [hoveredStar, setHoveredStars] = React.useState<number | null>(null);
  return (
    <>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold text-white">
          Review:
        </label>
        <input
          type="text"
          value={review}
          required
          onChange={(e) => setReview(e.target.value)}
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold text-white">
          Stars:
        </label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((value) => (
            <AiFillStar
              key={value}
              className={`h-5 w-5 cursor-pointer ${
                hoveredStar !== null
                  ? value <= hoveredStar
                    ? "text-yellow-500"
                    : "text-gray-400"
                  : value <= stars
                  ? "text-yellow-500"
                  : "text-gray-400"
              }`}
              onClick={() => setStars(value)}
              onMouseEnter={() => setHoveredStars(value)}
              onMouseLeave={() => setHoveredStars(null)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ReviewInputs;
