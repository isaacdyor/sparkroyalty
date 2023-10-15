import Link from "next/link";
import React from "react";
import type { ReviewType } from "~/types/types";
import { timeAgo } from "~/utils/helperFunctions";
import SingleStarsComponent from "./singleStars";

const ReviewCard: React.FC<{ review: ReviewType }> = ({ review }) => {
  return (
    <div className="rounded bg-gray-800 p-6 text-white">
      <h2 className="mb-2 text-xl">
        <Link className="hover:text-gray-400" href={`/review/${review.id}`}>
          {review.review}
        </Link>
      </h2>
      <SingleStarsComponent stars={review.stars} />
      <p className="mt-2 text-gray-400">
        -
        <Link
          className=" hover:underline"
          href={`/founder/${review.founder!.id}`}
        >
          {review.founder!.fullName}
        </Link>
      </p>
      <p className="mt-2 text-gray-400">{timeAgo(review.createdAt)}</p>
    </div>
  );
};

export default ReviewCard;
