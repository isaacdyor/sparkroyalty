import React from "react";
import Link from "next/link";
import type { ReviewType } from "~/types/types";

const ReviewTitle: React.FC<{ reviewData: ReviewType }> = ({ reviewData }) => {
  return (
    <>
      {reviewData.revieweeType === "FOUNDER" && (
        <h1 className="mb-1 text-2xl font-bold text-white">
          Review of{" "}
          <Link
            href={`/founder/${reviewData.founderId}`}
            className="text-blue-500 hover:text-blue-600"
          >
            {reviewData.founder!.fullName}
          </Link>{" "}
          by{" "}
          <Link
            href={`/investor/${reviewData.investorId}`}
            className="text-blue-500 hover:text-blue-600"
          >
            {reviewData.investor!.fullName}
          </Link>
        </h1>
      )}
      {reviewData.revieweeType === "INVESTOR" && (
        <h1 className="mb-1 text-2xl font-bold text-white">
          Review of{" "}
          <Link
            href={`/investor/${reviewData.investorId}`}
            className="text-blue-500 hover:text-blue-600"
          >
            {reviewData.investor!.fullName}
          </Link>{" "}
          by{" "}
          <Link
            href={`/founder/${reviewData.founderId}`}
            className="text-blue-500 hover:text-blue-600"
          >
            {reviewData.founder!.fullName}
          </Link>
        </h1>
      )}
    </>
  );
};

export default ReviewTitle;
