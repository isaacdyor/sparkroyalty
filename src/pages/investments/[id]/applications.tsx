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

  if (data.status !== "PENDING") {
    return (
      <div>
        <p>You have already selected an investor</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="mt-8 w-full max-w-6xl rounded border border-border p-6">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Applications for {data.title}
        </h1>
        {data.applications.length == 0 && (
          <div>
            <p className="text-center text-xl">
              Nobody has applied for your post yet. Give it some time or improve
              your offer!
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {data.applications.map((application) => (
            <div
              key={application.id}
              className="rounded bg-secondary p-6 text-white"
            >
              <h2 className="mb-2 text-2xl font-semibold">
                <Link
                  className="hover:text-slate-300"
                  href={`/investor/${application.investorId}`}
                >
                  {application.investor!.fullName}&apos;s
                </Link>{" "}
                application
              </h2>

              <p className="pb-2">
                <span className="font-semibold">Occupation:</span>{" "}
                {application.investor!.title}
              </p>
              <p className="pb-2">
                <span className="font-semibold">Bio:</span>{" "}
                {application.investor!.bio}
              </p>
              <p className="pb-2">
                <span className="font-semibold">Education and Experience:</span>{" "}
                {application.investor!.educationAndExperience}
              </p>
              <p className="pb-2">
                <span className="font-semibold">Country:</span>{" "}
                {application.investor!.country}
              </p>
              <div>
                <p className="pb-2">
                  <span className="font-semibold">Skills:</span>
                </p>
                <div className="flex pb-2">
                  {application.investor!.skills?.map((skill) => (
                    <p
                      className="mb-1 mr-1 rounded-2xl border border-gray-600 bg-gray-700 p-1 px-2" // Add margin to create spacing between skills
                      key={skill.id}
                    >
                      {skill.skill}
                    </p>
                  ))}
                </div>
              </div>

              <p className="pb-2">
                Reason for interest: {application.projectInterest}
              </p>
              <p className="pb-2">
                Project Specific Skills: {application.projectSkills}
              </p>
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
