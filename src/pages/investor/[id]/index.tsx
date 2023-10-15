import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next/types";
import Loading from "~/components/conditionals/loading";
import InvalidID from "~/components/conditionals/invalidId";
import InvestorProfileComponent from "~/components/profile/investorProfile";
import { clerkClient } from "@clerk/nextjs/server";

const InvestorProfilePage: NextPage<{ id: string; imageUrl: string }> = ({
  id,
  imageUrl,
}) => {
  const { data, isLoading } = api.investors.getOne.useQuery({ investorId: id });

  if (isLoading) return <Loading />;

  if (!data) return <InvalidID />;

  return (
    <div className="flex justify-center">
      <InvestorProfileComponent investor={data} imageUrl={imageUrl} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;

  if (typeof id !== "string") throw new Error("no id");

  const user = await clerkClient.users.getUser(id);
  const imageUrl = user.imageUrl;

  return {
    props: {
      id,
      imageUrl,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default InvestorProfilePage;
