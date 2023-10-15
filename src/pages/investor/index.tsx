import { api } from "~/utils/api";
import type { NextPage } from "next/types";
import Link from "next/link";
import Unauthorized from "~/components/conditionals/unauthorized";
import Loading from "~/components/conditionals/loading";
import InvestorProfileComponent from "~/components/profile/investorProfile";
import { useUser } from "@clerk/nextjs";

const CurrentInvestorProfilePage: NextPage = () => {
  const { data, isLoading, error } = api.investors.getCurrent.useQuery();
  const { user, isLoaded } = useUser();

  if (isLoading ?? !isLoaded) return <Loading />;

  if (!data) {
    return isLoading ? null : (
      <div className="flex h-screen items-center justify-center">
        <Link href="/investor/create">Create a investor profile here</Link>
      </div>
    );
  }

  if (error ?? !user) return <Unauthorized />;

  return (
    <div className="flex justify-center ">
      <InvestorProfileComponent investor={data} imageUrl={user.imageUrl} />
    </div>
  );
};

export default CurrentInvestorProfilePage;
