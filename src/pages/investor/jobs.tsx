import type { NextPage } from "next";
import { api } from "~/utils/api";
import Link from "next/link";
import CompleteJobButton from "~/components/investment/completeJob";
import Loading from "~/components/conditionals/loading";
import Unauthorized from "~/components/conditionals/unauthorized";
import InvalidID from "~/components/conditionals/invalidId";
import { formatCurrency } from "~/utils/helperFunctions";
import { InvestmentStatusType } from "@prisma/client";

const JobPage: NextPage = () => {
  const { data, isLoading, error } = api.investments.getJobs.useQuery();

  if (isLoading) return <Loading />;

  if (!data) return <InvalidID />;

  if (error) return <Unauthorized />;

  const getpayoutPercent = (currentPayout: number, totalPayout: number) => {
    return (currentPayout / totalPayout) * 100;
  };

  return (
    <div className="flex justify-center pt-6 ">
      <div className=" w-full max-w-4xl rounded border-2 border-border p-6 px-12">
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
          <div>
            {data.map((investment) => (
              <div
                key={investment.id}
                className="m-1 flex justify-between overflow-hidden rounded bg-gray-800 p-6 pr-4 text-white"
              >
                <div className="flex h-full w-3/4 flex-col justify-between">
                  <div>
                    <h2 className="mb-2 text-2xl font-semibold text-white  ">
                      <Link
                        className="hover:text-slate-600"
                        href={`/investments/${investment.id}`}
                      >
                        {investment.title}
                      </Link>
                    </h2>

                    <p className="mb-3 text-gray-300">
                      {investment.description}
                    </p>
                    <div className="flex pb-4">
                      {investment.skills.map((skill) => (
                        <p
                          key={skill.id}
                          className="mr-1 rounded-full bg-slate-600 p-1 px-2"
                        >
                          {skill.skill}
                        </p>
                      ))}
                    </div>
                    <p className="mb-3 text-gray-300">
                      <span className="font-semibold">Royalty Percentage:</span>{" "}
                      {investment.percent}%
                    </p>
                    <p className="mb-3 text-gray-300">
                      <span className="font-semibold">Total Payout:</span>{" "}
                      {formatCurrency(investment.totalPayout)}
                    </p>
                  </div>
                </div>

                {investment.status === InvestmentStatusType.BUILDING && (
                  <div className="w-1/5">
                    <div className="flex  w-full flex-col">
                      <p className="pb-12 text-right text-muted-foreground">
                        In Progress
                      </p>
                      <div className="pb-6">
                        <CompleteJobButton investment={investment} />
                      </div>
                      <button className="rounded-full bg-slate-600 p-1.5 hover:bg-slate-700">
                        Update
                      </button>
                    </div>
                  </div>
                )}
                {(investment.status === InvestmentStatusType.PAYOUT ||
                  investment.status === InvestmentStatusType.COMPLETED) && (
                  <div className="w-1/5">
                    <div className="flex  w-full flex-col">
                      <p className="pb-20 text-right text-muted-foreground">
                        Completed
                      </p>
                      <div className=" mr-4 h-4 w-full rounded-full bg-slate-600">
                        {getpayoutPercent(
                          investment.currentPayout,
                          investment.totalPayout
                        ) > 0 && (
                          <div
                            className={` mb-3 h-full w-[${getpayoutPercent(
                              investment.currentPayout,
                              investment.totalPayout
                            )}%] ${
                              getpayoutPercent(
                                investment.currentPayout,
                                investment.totalPayout
                              ) == 100 && "rounded-full"
                            } rounded-l-full bg-blue-500`}
                          ></div>
                        )}
                        <p className="text-center">
                          {formatCurrency(investment.currentPayout)}/
                          {formatCurrency(investment.totalPayout)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPage;
