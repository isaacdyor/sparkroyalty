import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next/types";
import { useUser } from "@clerk/nextjs";
import Loading from "~/components/conditionals/loading";
import InvalidID from "~/components/conditionals/invalidId";
import Unauthorized from "~/components/conditionals/unauthorized";
import EditApplication from "~/components/application/editApplication";
import DeleteApplication from "~/components/application/deleteApplication";
import AcceptApplication from "~/components/application/acceptApplication";
import { ActiveType } from "~/types/types";

const ApplicationDetailPage: NextPage<{ applicationId: string }> = ({
  applicationId,
}) => {
  const { user } = useUser();

  const { data, isLoading } = api.applications.getByApplicationId.useQuery({
    applicationId,
  });

  if (isLoading) return <Loading />;

  if (!data) return <InvalidID />;

  if (data.investorId != user?.id) return <Unauthorized />;

  return (
    <div className="flex justify-center ">
      <div className="mt-8 w-full max-w-4xl rounded border-2 border-border p-6 px-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Application for {data.investment.title}
        </h1>
        <div className=" rounded p-6 text-white">
          <h2 className="mb-2 text-lg ">
            <span className="font-bold">Reason for interest:</span>{" "}
            {data.projectInterest}
          </h2>
          <h2 className="mb-2 text-xl ">
            <span className="font-bold">
              Their relative skills and experience:
            </span>{" "}
            {data.projectInterest}
          </h2>
          {user?.id === data.investorId &&
            user?.unsafeMetadata.active === ActiveType.INVESTOR && (
              <div className="flex">
                <div className="mr-1">
                  <EditApplication applicationId={data.id} />
                </div>

                <DeleteApplication applicationId={data.id} />
              </div>
            )}
          {user?.id === data.investment.founderId &&
            user.unsafeMetadata.active === ActiveType.FOUNDER && (
              <AcceptApplication
                applicationId={data.id}
                investment={data.investment}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const applicationId = params?.id;

  if (typeof applicationId !== "string") throw new Error("no id");

  return {
    props: {
      applicationId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ApplicationDetailPage;
