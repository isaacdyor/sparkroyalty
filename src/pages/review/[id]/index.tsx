import { useUser } from "@clerk/nextjs";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import InvalidID from "~/components/conditionals/invalidId";
import Loading from "~/components/conditionals/loading";
import DeleteReviewButton from "~/components/review/deleteReviewButton";
import ReviewTitle from "~/components/review/reviewTitle";
import { ActiveType } from "~/types/types";

import { api } from "~/utils/api";
import SingleStarsComponent from "~/components/review/singleStars";

const ReviewDetailPage: NextPage<{ reviewId: string }> = ({ reviewId }) => {
  const { user } = useUser();
  const { data: reviewData, isLoading } = api.reviews.getByReviewId.useQuery({
    reviewId,
  });

  console.log(reviewData);
  console.log(user);

  if (isLoading) return <Loading />;

  if (!reviewData) return <InvalidID />;

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="m-6 w-full max-w-md rounded border border-slate-600 bg-black p-8 shadow-md">
        <ReviewTitle {...{ reviewData }} />
        <p className="mb-1 text-xl">{reviewData.review}</p>
        <SingleStarsComponent stars={reviewData.stars} />
        {((reviewData.revieweeType === "FOUNDER" &&
          reviewData.founderId === user?.id &&
          user?.unsafeMetadata.active === ActiveType.FOUNDER) ||
          (reviewData.revieweeType === "INVESTOR" &&
            reviewData.investorId === user?.id &&
            user?.unsafeMetadata.active === ActiveType.INVESTOR)) && (
          <div>
            <button className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
              <Link href={`/review/${reviewId}/edit`}>Edit</Link>
            </button>
            <DeleteReviewButton {...{ reviewId }} />
          </div>
        )}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const reviewId = params?.id;

  if (typeof reviewId !== "string") throw new Error("no id");

  return {
    props: {
      reviewId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ReviewDetailPage;
