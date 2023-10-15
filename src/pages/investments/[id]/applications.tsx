import { useUser } from "@clerk/nextjs";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import AcceptApplication from "~/components/application/acceptApplication";
import InvalidID from "~/components/conditionals/invalidId";
import Loading from "~/components/conditionals/loading";
import Unauthorized from "~/components/conditionals/unauthorized";
import { ActiveType } from "~/types/types";
import { api } from "~/utils/api";

const ApplicationListPage: NextPage<{ id: string }> = ({ id }) => {
  const { user, isLoaded } = useUser();

  const { data, isLoading } = api.investments.getByInvestmentId.useQuery({
    id,
  });

  if (isLoading || !isLoaded) return <Loading />;

  if (!data) return <InvalidID />;

  if (data.founderId !== user?.id) return <Unauthorized />;

  if (user?.unsafeMetadata.active !== ActiveType.FOUNDER)
    return <Unauthorized />;

  if (!data.applications.length) {
    return (
      <div>
        <p>No applications yet</p>
      </div>
    );
  }

  if (data.status !== "PENDING") {
    return (
      <div>
        <p>You have already selected an investor</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-black">
      <div className="mt-8 w-full max-w-6xl rounded border border-slate-600 p-6">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Applications for {data.title}
        </h1>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {data.applications.map((application) => (
            <div
              key={application.id}
              className="rounded bg-gray-800 p-6 text-white"
            >
              <Link href={`/applications/${application.id}`}>
                <h2 className="mb-2 text-xl font-semibold">
                  {application.investor!.fullName}&apos;s application
                </h2>
              </Link>

              <p>Why I am interested: {application.projectInterest}</p>
              <p>What skills I have: {application.projectSkills}</p>
              <p>Status: {application.status}</p>
              <AcceptApplication
                applicationId={application.id}
                investment={data}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;

  if (typeof id !== "string") throw new Error("no id");

  return {
    props: {
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ApplicationListPage;
