import type { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import InvalidID from "~/components/conditionals/invalidId";
import Loading from "~/components/conditionals/loading";
import Unauthorized from "~/components/conditionals/unauthorized";
import EditReviewButton from "~/components/review/editReview";
import ReviewForm from "~/components/review/reviewForm";
import { api } from "~/utils/api";

const InvestorReviewPage: NextPage<{ founderId: string }> = ({ founderId }) => {
  const {
    data: reviewData,
    isLoading: reviewLoading,
    error: reviewError,
  } = api.reviews.founderReviewExists.useQuery({
    founderId,
  });

  const {
    data: investmentData,
    isLoading: investmentLoading,
    error: investmentError,
  } = api.investments.relationshipExistsFounder.useQuery({
    founderId,
  });

  const { data: founderData, isLoading: founderLoading } =
    api.founders.getOne.useQuery({
      founderId,
    });

  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);

  if (reviewLoading || founderLoading || investmentLoading) {
    return <Loading />;
  }

  if (!founderData) return <InvalidID />;

  if (reviewError ?? investmentError) return <Unauthorized />;

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
      <p>
        You have already submitted a review of this founder. You can edit this
        review here:
        <EditReviewButton reviewId={reviewData.id} />
      </p>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="m-6 w-full max-w-md rounded border border-slate-600 bg-black p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-white">
          Submit Review for {founderData.fullName}
        </h1>
        <ReviewForm
          id={founderId}
          review={review}
          stars={stars}
          revieweeType="FOUNDER"
          setReview={setReview}
          setStars={setStars}
        />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const founderId = params?.id;

  if (typeof founderId !== "string") throw new Error("no id");

  return {
    props: {
      founderId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default InvestorReviewPage;
