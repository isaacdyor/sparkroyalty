import { api } from "~/utils/api";
import type { GetServerSideProps, NextPage } from "next/types";
import Unauthorized from "~/components/conditionals/unauthorized";
import Loading from "~/components/conditionals/loading";
import FounderProfileComponent from "~/components/profile/founderProfile";
import CreateFounder from "~/components/conditionals/createFounder";
import { useUser } from "@clerk/nextjs";
import InvestorProfileComponent from "~/components/profile/investorProfile";
import { ActiveType } from "~/types/types";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

const CurrentFounderProfilePage: NextPage<{ active: ActiveType }> = ({
  active,
}) => {
  const { data: investor, isLoading: investorLoading } =
    api.investors.getCurrent.useQuery(undefined, {
      enabled: active === ActiveType.INVESTOR,
    });

  const { data: founder, isLoading: founderLoading } =
    api.founders.getCurrent.useQuery(undefined, {
      enabled: active === ActiveType.FOUNDER,
    });
  const { user, isLoaded } = useUser();

  console.log(active === ActiveType.INVESTOR && investorLoading);
  if (!isLoaded) return <Loading />;
  if (active == ActiveType.FOUNDER && founderLoading) return <Loading />;
  if (active == ActiveType.INVESTOR && investorLoading) return <Loading />;

  // if (!investor && !founder) return <p>Where yo account?</p>;

  if (!user) return <Unauthorized />;

  return (
    <div className="flex justify-center px-4 ">
      {user.unsafeMetadata.active == ActiveType.FOUNDER && founder && (
        <FounderProfileComponent founder={founder} imageUrl={user.imageUrl} />
      )}
      {user.unsafeMetadata.active == ActiveType.INVESTOR && investor && (
        <InvestorProfileComponent
          investor={investor}
          imageUrl={user.imageUrl}
        />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in?redirect_url=" + ctx.resolvedUrl,
        permanent: false,
      },
    };
  }

  const user = await clerkClient.users.getUser(userId);
  const active = user.unsafeMetadata.active;

  return {
    props: {
      active,
    },
  };
};

export default CurrentFounderProfilePage;
