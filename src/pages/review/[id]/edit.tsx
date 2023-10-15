import { useState } from "react";
import { api } from "~/utils/api";
import type { GetServerSideProps, NextPage } from "next/types";
import { helpers } from "~/server/helpers/ssgHelper";
import { useUser } from "@clerk/nextjs";
import InvalidID from "~/components/conditionals/invalidId";
import Loading from "~/components/conditionals/loading";
import Unauthorized from "~/components/conditionals/unauthorized";
import router from "next/router";
import ReviewInputs from "~/components/review/reviewInputs";
import { ActiveType } from "~/types/types";

const EditReviewPage: NextPage<{
  reviewId: string;
}> = ({ reviewId }) => {
  const { user } = useUser();

  const { data: reviewData, isLoading } = api.reviews.getByReviewId.useQuery({
    reviewId,
  });

  const { mutate: updateReview } = api.reviews.update.useMutation({
    onSuccess: async () => {
      await router.push(`/review/${reviewId}`);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating review:", errorMessage);
    },
  });

  const [review, setReview] = useState(reviewData?.review ?? "");
  const [stars, setStars] = useState(reviewData?.stars ?? 1);

  if (isLoading) return <Loading />;

  if (!reviewData) return <InvalidID />;

  if (
    reviewData.revieweeType === "FOUNDER" &&
    user?.id !== reviewData.founderId &&
    user?.unsafeMetadata.active !== ActiveType.FOUNDER
  ) {
    return <Unauthorized />;
  }

  if (
    reviewData.revieweeType === "INVESTOR" &&
    user?.id !== reviewData.investorId &&
    user?.unsafeMetadata.active !== ActiveType.INVESTOR
  ) {
    return <Unauthorized />;
  }

  return (
    <div className="flex flex-grow items-center justify-center bg-black p-4">
      <div className="w-full max-w-xl rounded border border-slate-600 bg-black p-6">
        <h1 className="mb-4 text-2xl font-semibold text-white">
          Update Founder Profile
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateReview({
              review,
              stars,
              reviewId,
            });
          }}
        >
          <ReviewInputs {...{ review, stars, setReview, setStars }} />
          <button className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const reviewId = ctx.params?.id;

  if (typeof reviewId !== "string") {
    throw new Error("no id");
  }

  await helpers.reviews.getByReviewId.prefetch({ reviewId });

  return {
    props: {
      reviewId,
      trpcState: helpers.dehydrate(),
    },
  };
};

export default EditReviewPage;
