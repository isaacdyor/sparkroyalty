import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import InvalidID from "~/components/conditionals/invalidId";
import Loading from "~/components/conditionals/loading";
import Unauthorized from "~/components/conditionals/unauthorized";
import ReviewForm from "~/components/review/reviewForm";
import { api } from "~/utils/api";

const InvestorReviewPage: NextPage<{ investorId: string }> = ({
  investorId,
}) => {
  const {
    data: reviewData,
    isLoading: reviewLoading,
    error,
  } = api.reviews.investorReviewExists.useQuery({
    investorId,
  });

  const { data: investmentData, isLoading: investmentLoading } =
    api.investments.relationshipExistsInvestor.useQuery({
      investorId,
    });

  const { data: investorData, isLoading: investorLoading } =
    api.investors.getOne.useQuery({
      investorId,
    });

  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);

  if (reviewLoading || investorLoading || investmentLoading) return <Loading />;

  if (!investorData) return <InvalidID />;

  if (error) return <Unauthorized />;

  if (!investmentData) {
    return (
      <div className="flex h-screen items-center justify-center">
        You must have worked with this founder to give them a review. Your
        project must be completed or in the payout stage.
      </div>
    );
  }

  if (reviewData) {
    return (
      <div>
        <p>
          You have already submitted a review of this investor. You can edit
          this review
          <Link
            href={`/review/${reviewData.id}/edit`}
            className="text-blue-500 hover:text-blue-600"
          >
            here
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="m-6 w-full max-w-md rounded border border-slate-600 bg-black p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-white">
          Submit Review for {investorData.fullName}
        </h1>
        <ReviewForm
          id={investorId}
          review={review}
          stars={stars}
          revieweeType="INVESTOR"
          setReview={setReview}
          setStars={setStars}
        />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const investorId = params?.id;

  if (typeof investorId !== "string") throw new Error("no id");

  return {
    props: {
      investorId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default InvestorReviewPage;
