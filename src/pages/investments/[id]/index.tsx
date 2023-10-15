import { useUser } from "@clerk/nextjs";
import type { GetStaticProps, NextPage } from "next";
import { BsFillBookmarkFill } from "react-icons/bs";
import Loading from "~/components/conditionals/loading";
import { api } from "~/utils/api";

import {
  capitalizeFirstLetter,
  formatCurrency,
  timeAgo,
} from "~/utils/helperFunctions";
import { InvestmentStatusType } from "@prisma/client";
import { ActiveType } from "~/types/types";
import Link from "next/link";
import MultiStarsComponent from "~/components/review/multiStars";
import { BiSolidMessageDetail } from "react-icons/bi";
import CompleteJobButton from "~/components/investment/completeJob";
import DeleteInvestmentButton from "~/components/investment/deleteInvestment";

const DetailPage: NextPage<{ id: string }> = ({ id }) => {
  const { user } = useUser();

  const { data, isLoading } = api.investments.getByInvestmentId.useQuery({
    id,
  });

  if (isLoading) return <Loading />;

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        Invalid ID
      </div>
    );
  }

  const totalSpent = data.founder.investments
    .map((investment) => {
      return investment.currentPayout;
    })
    .reduce((a, b) => a + b, 0);

  const openInvestments = data.founder.investments.filter(
    (investment) => investment.status === InvestmentStatusType.PENDING
  ).length;

  const paidInvesmtnets = data.founder.investments.filter(
    (investment) => investment.currentPayout > 0
  ).length;

  let completedJobs;
  let openJobs;

  if (data.investor) {
    completedJobs = data.investor.investments.filter(
      (investment) =>
        investment.status === InvestmentStatusType.COMPLETED ||
        investment.status === InvestmentStatusType.PAYOUT
    ).length;
    openJobs = data.investor.investments.filter(
      (investment) => investment.status === InvestmentStatusType.BUILDING
    ).length;
  }

  const payoutPercent = (data.currentPayout / data.totalPayout) * 100;

  return (
    <div className="flex justify-center pb-32 pt-4">
      <div className="flex w-3/4 items-center justify-center rounded border-2 border-border text-white">
        <div className="flex w-3/4 flex-col">
          <div className="flex flex-col border border-transparent border-b-border border-r-border  p-6">
            <div className="flex items-center pb-6">
              <h2 className="pr-4 text-2xl font-bold text-white ">
                {data.title}
              </h2>
              {data.status === InvestmentStatusType.PENDING && (
                <p className="rounded-full bg-blue-400 px-3  text-center text-white">
                  Open
                </p>
              )}
              {(data.status === InvestmentStatusType.BUILDING ||
                data.status === InvestmentStatusType.PAYOUT) && (
                <p className="rounded-full bg-blue-400 px-3 text-center text-white">
                  In progress
                </p>
              )}

              {data.status === InvestmentStatusType.COMPLETED && (
                <p className="rounded-full bg-blue-400 px-3  text-center text-white">
                  Completed
                </p>
              )}
            </div>
            <p className="">{data.workType}</p>
            <p className="text-muted-foreground">
              Posted {timeAgo(data.createdAt)}
            </p>
          </div>
          <div className="flex flex-col border border-transparent border-b-border border-r-border p-6">
            <h2 className="pb-2 font-bold text-white">Company Description:</h2>
            <p className="text-white">{data.description}</p>
          </div>
          <div className="flex h-24 justify-between border border-transparent border-b-border border-r-border p-6">
            <div className="flex flex-col">
              <p className="text-muted-foreground">Payment Basis:</p>
              <p>{capitalizeFirstLetter(data.paymentBasis)}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-muted-foreground">Roytalty Rate:</p>
              <p>{data.percent}%</p>
            </div>
            <div className="flex flex-col">
              <p className="text-muted-foreground">Total Payout:</p>
              <p>{formatCurrency(data.totalPayout)}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-muted-foreground">Payout Frequency:</p>
              <p>{capitalizeFirstLetter(data.payoutFrequency)}</p>
            </div>
          </div>
          <div className="flex flex-col border border-transparent border-b-border border-r-border p-6">
            <h2 className="pb-2 font-bold text-white">Current Payout:</h2>
            <div className="flex items-center">
              <div className="mr-4 h-4 w-full rounded-full bg-secondary">
                {payoutPercent > 0 && (
                  <div
                    className={` h-full w-[${payoutPercent.toString()}%] ${
                      payoutPercent == 100 && "rounded-full"
                    } rounded-l-full bg-blue-500`}
                  ></div>
                )}
              </div>
              <p>
                {formatCurrency(data.currentPayout)}/
                {formatCurrency(data.totalPayout)}
              </p>
            </div>
          </div>
          <div className="flex flex-col border border-transparent border-b-border border-r-border p-6">
            <h2 className="pb-2 font-bold text-white">Services Needed:</h2>
            <p className="text-white">{data.workDescription}</p>
          </div>
          <div className="flex flex-col border border-transparent border-r-border p-6">
            <div className="w-1/2">
              <h2 className="pb-2 font-bold text-white">Recommended Skills:</h2>
              <div className="mt-2 flex flex-wrap ">
                {data.skills?.map((skill) => (
                  <p
                    className="mb-1 mr-1 rounded-2xl bg-secondary p-1 px-2"
                    key={skill.id}
                  >
                    {skill.skill}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-full w-1/4 flex-col">
          {data.status === InvestmentStatusType.PENDING && (
            <>
              {user?.unsafeMetadata.active === ActiveType.INVESTOR && (
                <div className="flex flex-col border border-transparent border-b-border  p-4">
                  <Link
                    className="mb-4 rounded-full bg-blue-500 p-2 text-center font-semibold hover:bg-blue-600"
                    href={`/investments/${data.id}/apply`}
                  >
                    <button>Apply Now</button>
                  </Link>
                  <button className=" rounded-full border border-blue-500 p-2 font-semibold text-blue-500 hover:bg-blue-500 hover:bg-opacity-10">
                    Message
                  </button>
                  <div className="mb-2 mt-6 flex items-center justify-center text-blue-500 hover:cursor-pointer hover:text-blue-600">
                    <BsFillBookmarkFill className="h-5 w-5 pr-1" />
                    <p>Save Investment</p>
                  </div>
                </div>
              )}
              {user?.unsafeMetadata.active === ActiveType.FOUNDER &&
                user?.id === data.founderId && (
                  <div className="flex flex-col border border-transparent border-b-border  p-4">
                    <Link
                      className="mb-4 rounded-full bg-blue-500 p-2 text-center font-semibold hover:bg-blue-600"
                      href={`/investments/${data.id}/edit`}
                    >
                      <button>Edit</button>
                    </Link>

                    <DeleteInvestmentButton investmentId={data.id} />
                    <p className="mb-2 mt-6 text-center ">
                      <Link
                        className="text-blue-500 hover:cursor-pointer hover:text-blue-600"
                        href={`/investments/${data.id}/applications`}
                      >
                        View Applications
                      </Link>
                    </p>
                  </div>
                )}
            </>
          )}
          {data.status === InvestmentStatusType.BUILDING &&
            user?.unsafeMetadata.active === ActiveType.INVESTOR &&
            user?.id === data.investorId && (
              <div className="flex flex-col border border-transparent border-b-border  p-4">
                <div className="pb-4 ">
                  <CompleteJobButton investment={data} />
                </div>
                <button className="rounded-full border border-blue-500 p-2 font-semibold text-blue-500 hover:bg-blue-500 hover:bg-opacity-10">
                  Message
                </button>
              </div>
            )}

          {data.status === InvestmentStatusType.PAYOUT &&
            user?.unsafeMetadata.active === ActiveType.FOUNDER &&
            user?.id === data.founderId && (
              <div className="flex flex-col border border-transparent border-b-border  p-4">
                <Link href={`/investments/${data.id}/reports/create`}>
                  <button className="mb-4 w-full rounded-full bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600">
                    Pay Investor
                  </button>
                </Link>
                <button className="rounded-full border border-blue-500 p-2 font-semibold text-blue-500 hover:bg-blue-500 hover:bg-opacity-10">
                  Message
                </button>
              </div>
            )}
          {data.status === InvestmentStatusType.COMPLETED && (
            <>
              {user?.unsafeMetadata.active === ActiveType.FOUNDER &&
                user?.id === data.founderId && (
                  <div className="flex flex-col border border-transparent border-b-neutral-500  p-4">
                    <Link href={`/investor/${data.investor!.id}/review`}>
                      <button className="mb-4 w-full rounded-full bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600">
                        Review Investor
                      </button>
                    </Link>
                    <button className="rounded-full border border-blue-500 p-2 font-semibold text-blue-500 hover:bg-blue-500 hover:bg-opacity-10">
                      Message
                    </button>
                  </div>
                )}
              {user?.unsafeMetadata.active === ActiveType.INVESTOR &&
                user?.id === data.investorId && (
                  <div className="flex flex-col border border-transparent border-b-neutral-500  p-4">
                    <Link href={`/founder/${data.founder!.id}/review`}>
                      <button className="mb-4 w-full rounded-full bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600">
                        Review Founder
                      </button>
                    </Link>
                    <button className="rounded-full border border-blue-500 p-2 font-semibold text-blue-500 hover:bg-blue-500 hover:bg-opacity-10">
                      Message
                    </button>
                  </div>
                )}
            </>
          )}

          {user?.id !== data.founderId && (
            <div
              className={`flex border border-transparent ${
                data.investor ? "border-b-neutral-500" : "grow"
              }  flex-col p-6`}
            >
              <h2 className="pb-3 font-bold text-white">
                Founder Information:
              </h2>
              <div className="flex items-center">
                <p>
                  <Link
                    className="hover:text-muted-foreground"
                    href={`/founder/${data.founder.id}`}
                  >
                    {data.founder.fullName}
                  </Link>
                </p>
                <BiSolidMessageDetail className="ml-2 mt-1 h-5 w-5 text-blue-500 hover:cursor-pointer hover:text-blue-600" />
              </div>

              <p className="pb-4 text-muted-foreground">
                Member since {data.founder.createdAt.toLocaleDateString()}
              </p>
              <div className="flex pb-5">
                <MultiStarsComponent reviews={data.founder.reviews} />
                {data.founder.reviews.length > 0 && (
                  <Link href={`/founder/${data.founder.id}/reviews`}>
                    <p className="ml-1 hover:text-muted-foreground">
                      ({data.founder.reviews.length})
                    </p>
                  </Link>
                )}
              </div>
              <p className="">{data.founder.country}</p>
              <p className="pb-4 text-muted-foreground">English</p>
              <p className="">
                {data.founder.investments.length} investments posted
              </p>
              <p className="pb-4 text-muted-foreground">
                {openInvestments} open{" "}
                {data.founder.investments.length - openInvestments} closed
              </p>

              <p className="">{formatCurrency(totalSpent)} paid out</p>
              {paidInvesmtnets > 0 && (
                <p className="pb-5 text-muted-foreground">
                  Through {paidInvesmtnets} investment
                  {paidInvesmtnets > 1 && "s"}
                </p>
              )}
              <h2 className="pt-8 font-bold text-white">Verification:</h2>
            </div>
          )}

          {data.investor && user?.id !== data.investorId && (
            <div className="flex h-32 grow flex-col p-6">
              <h2 className="pb-3 font-bold text-white">
                Investor Information:
              </h2>
              <div className="flex items-center">
                <p>
                  <Link
                    className="hover:text-muted-foreground"
                    href={`/investor/${data.investor.id}`}
                  >
                    {data.investor.fullName}
                  </Link>
                </p>
                <BiSolidMessageDetail className="ml-2 mt-1 h-5 w-5 text-blue-500 hover:cursor-pointer hover:text-blue-600" />
              </div>
              <p className="pb-4 text-muted-foreground">
                Member since {data.investor.createdAt.toLocaleDateString()}
              </p>
              <div className="flex pb-5">
                <MultiStarsComponent reviews={data.investor.reviews} />
                {data.investor.reviews.length > 0 && (
                  <Link href={`/investor/${data.investor.id}/reviews`}>
                    <p className="ml-1 hover:text-muted-foreground">
                      ({data.investor.reviews.length ?? 0})
                    </p>
                  </Link>
                )}
              </div>
              <p className="">{data.investor.country}</p>
              <p className="pb-4 text-muted-foreground">English</p>
              <p className="">{completedJobs} jobs completed</p>
              <p className="pb-4 text-muted-foreground">
                {openJobs} currently working
              </p>

              <h2 className="pt-8 font-bold text-white">Verification:</h2>
            </div>
          )}
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

export default DetailPage;
