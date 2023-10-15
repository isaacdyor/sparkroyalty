import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next/types";
import InvalidID from "~/components/conditionals/invalidId";
import Loading from "~/components/conditionals/loading";
import ReviewCard from "~/components/review/reviewCard";

const InvestorReviewListPage: NextPage<{ investorId: string }> = ({
  investorId,
}) => {
  const { data: reviewData, isLoading: reviewLoading } =
    api.reviews.getByInvestorId.useQuery({
      investorId,
    });

  const { data: investorData, isLoading: investorLoading } =
    api.investors.getOne.useQuery({
      investorId,
    });

  if (reviewLoading || investorLoading) return <Loading />;

  if (!reviewData || !investorData) return <InvalidID />;

  return (
    <div className="flex justify-center bg-black">
      <div className="mt-8 w-full max-w-6xl rounded border border-slate-600 p-6">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          <a
            href={`/investor/${investorData.id}`}
            className="text-white hover:underline"
          >
            {investorData.fullName}&apos;s Reviews
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
  const investorId = ctx.params?.id;

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

export default InvestorReviewListPage;
