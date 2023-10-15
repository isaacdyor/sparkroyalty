import type { NextPage } from "next";
import { api } from "~/utils/api";
import Link from "next/link";
import CompleteJobButton from "~/components/investment/completeJob";
import Loading from "~/components/conditionals/loading";
import Unauthorized from "~/components/conditionals/unauthorized";
import InvalidID from "~/components/conditionals/invalidId";

const JobPage: NextPage = () => {
  const { data, isLoading, error } = api.investments.getJobs.useQuery();

  if (isLoading) return <Loading />;

  if (!data) return <InvalidID />;

  if (error) return <Unauthorized />;

  return (
    <div className="flex min-h-screen justify-center ">
      <div className=" w-full max-w-6xl rounded p-6">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Your Jobs
        </h1>
        {data.length === 0 ? (
          <div className="text-center text-white">
            <div className="flex items-center justify-center">
              <p className="">No jobs yet. Find a startup to invest in </p>

              <Link
                className="ml-1 underline hover:text-gray-300"
                href="/investments"
              >
                here
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {data.map((investment) => (
              <div
                key={investment.id}
                className="m-1 overflow-hidden rounded bg-gray-800 p-6 text-white"
              >
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <h2 className="mb-2 text-2xl font-semibold text-white transition duration-300 ease-in-out hover:text-blue-400">
                      <Link href={`/investments/${investment.id}`}>
                        {investment.title}
                      </Link>
                    </h2>

                    <p className="mb-3 text-gray-300">
                      <span className="font-semibold">Work Type:</span>{" "}
                      {investment.workType}
                    </p>
                    <p className="mb-3 text-gray-300">
                      <span className="font-semibold">Description:</span>{" "}
                      {investment.description}
                    </p>
                    <p className="mb-3 text-gray-300">
                      <span className="font-semibold">Current Payout:</span>{" "}
                      {investment.currentPayout}
                    </p>
                    <p className="mb-3 text-gray-300">
                      <span className="font-semibold">Payout Total ($):</span>{" "}
                      {investment.totalPayout}
                    </p>
                    <p className="mb-3 text-gray-300">
                      <span className="font-semibold">Extra Details:</span>{" "}
                      {investment.extraDetails}
                    </p>
                  </div>
                  <div className="w-40">
                    <CompleteJobButton investment={investment} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPage;
