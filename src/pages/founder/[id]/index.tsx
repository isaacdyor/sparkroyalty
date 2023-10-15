import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next/types";
import InvalidID from "~/components/conditionals/invalidId";
import Loading from "~/components/conditionals/loading";
import FounderProfileComponent from "~/components/profile/founderProfile";
import InvestmentCard from "~/components/investment/investmentCard";
import { clerkClient } from "@clerk/nextjs/server";

const FounderProfilePage: NextPage<{ founderId: string; imageUrl: string }> = ({
  founderId,
  imageUrl,
}) => {
  const { data: investmentData, isLoading: investmentLoading } =
    api.investments.getByFounderId.useQuery({
      founderId,
    });

  const { data: founderData, isLoading: founderLoading } =
    api.founders.getOne.useQuery({
      founderId,
    });

  if (investmentLoading || founderLoading) return <Loading />;

  if (!investmentData || !founderData) return <InvalidID />;

  return (
    <div className="flex justify-center">
      <div className="mt-8 flex w-full max-w-6xl flex-col rounded border-2 border-border p-6 ">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          {founderData.fullName}&apos;s Founder Profile
        </h1>
        <div className="md:flex md:space-x-4">
          <div className="md:w-1/2">
            <FounderProfileComponent
              founder={founderData}
              imageUrl={imageUrl}
            />
          </div>

          <div className="mt-4 rounded border border-slate-600 md:w-1/2">
            <p className="ml-4 mt-4 text-center text-2xl font-semibold">
              Investments
            </p>
            {investmentData.map((investment) => (
              <div className="m-3" key={investment.id}>
                <InvestmentCard investment={investment} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const founderId = params?.id;

  if (typeof founderId !== "string") throw new Error("no id");

  const user = await clerkClient.users.getUser(founderId);
  const imageUrl = user.imageUrl;

  return {
    props: {
      founderId,
      imageUrl,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default FounderProfilePage;
