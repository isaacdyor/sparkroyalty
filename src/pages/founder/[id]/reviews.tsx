import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next/types";
import InvalidID from "~/components/conditionals/invalidId";
import Loading from "~/components/conditionals/loading";
import ReviewCard from "~/components/review/reviewCard";

const FounderReviewListPage: NextPage<{ founderId: string }> = ({
  founderId,
}) => {
  const { data: reviewData, isLoading: reviewLoading } =
    api.reviews.getByFounderId.useQuery({
      founderId,
    });

  const { data: founderData, isLoading: founderLoading } =
    api.founders.getOne.useQuery({
      founderId,
    });

  console.log(reviewData);

  if (reviewLoading || founderLoading) return <Loading />;

  if (!reviewData || !founderData) return <InvalidID />;

  return (
    <div className="flex justify-center bg-black">
      <div className="mt-8 w-full max-w-6xl rounded border border-slate-600 p-6">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          <a
            href={`/founder/${founderData.id}`}
            className="text-white hover:underline"
          >
            {founderData.fullName}&apos;s Reviews
          </a>
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviewData?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const founderId = ctx.params?.id;

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

export default FounderReviewListPage;
