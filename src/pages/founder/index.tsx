import { api } from "~/utils/api";
import type { NextPage } from "next/types";
import Unauthorized from "~/components/conditionals/unauthorized";
import Loading from "~/components/conditionals/loading";
import FounderProfileComponent from "~/components/profile/founderProfile";
import CreateFounder from "~/components/conditionals/createFounder";
import { useUser } from "@clerk/nextjs";

const CurrentFounderProfilePage: NextPage = () => {
  const { data, isLoading, error } = api.founders.getCurrent.useQuery();
  const { user, isLoaded } = useUser();

  if (isLoading ?? !isLoaded) return <Loading />;

  if (!data) return <CreateFounder />;

  if (error ?? !user) return <Unauthorized />;

  return (
    <div className="flex justify-center bg-black">
      <FounderProfileComponent founder={data} imageUrl={user.imageUrl} />
    </div>
  );
};

export default CurrentFounderProfilePage;
