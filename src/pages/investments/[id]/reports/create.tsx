import React, { useState } from "react";
import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next/types";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Unauthorized from "~/components/conditionals/unauthorized";
import Loading from "~/components/conditionals/loading";
import { capitalizeFirstLetter, getAmountOwed } from "~/utils/helperFunctions";
import TextArea from "~/components/shared/textArea";
import InvalidID from "~/components/conditionals/invalidId";
import { ActiveType } from "~/types/types";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

const CreateReportPage: NextPage<{ investmentId: string }> = ({
  investmentId,
}) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const { data, isLoading } = api.investments.getByInvestmentId.useQuery({
    id: investmentId,
  });

  const [earnings, setEarnings] = useState("");
  const [progress, setProgress] = useState("");
  const [plans, setPlans] = useState("");
  const [page, setPage] = useState(1);

  const { mutate: createReport } = api.reports.create.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating report:", errorMessage);
    },
  });

  const { mutate: updatePayout } = api.investments.updatePayout.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  const { mutate: sendNotification } =
    api.investorNotifications.create.useMutation({
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        console.error("Error creating investment:", errorMessage);
      },
    });

  if (!data) return <InvalidID />;

  if (data.status !== "PAYOUT") {
    return (
      <div className="flex h-screen items-center justify-center">
        You are not in payout stage
      </div>
    );
  }

  if (isLoading || !isLoaded) return <Loading />;

  if (
    !user ||
    user.id !== data?.founderId ||
    user?.unsafeMetadata.active !== ActiveType.FOUNDER
  )
    return <Unauthorized />;

  const handlePay = async () => {
    const payout = getAmountOwed(parseFloat(earnings), data);
    if (data.currentPayout + payout >= data.totalPayout) {
      updatePayout({
        investmentId: data.id,
        payout: data.totalPayout,
        completed: true,
      });
      sendNotification({
        subject: "You have been fully paid out",
        content: `${data.founder.fullName} has paid you back the total amount of $${data.totalPayout}`,
        investorId: data.investorId!,
        notificationType: "FULL_PAY",
        link: `/founder/${data.founderId}/review`,
      });
      await router.push(`/investments/${investmentId}/reports`);
    } else {
      updatePayout({
        investmentId: data.id,
        payout: payout,
        completed: false,
      });
      sendNotification({
        subject: "You were just paid",
        content: `${data.founder.fullName} has just paid you $${payout}`,
        investorId: data.investorId!,
        notificationType: "PARTIAL_PAY",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handlePay();
    createReport({
      investmentId,
      earnings: parseInt(earnings),
      progress,
      plans,
    });
    await router.push(`/investments/${investmentId}/reports`);
  };

  return (
    <div className="flex flex-grow items-center justify-center p-4">
      <div className="w-full max-w-xl rounded border border-slate-600 p-6">
        <form
          onSubmit={(e) => {
            handleSubmit(e).catch((e) => console.error(e));
          }}
        >
          {page === 1 && (
            <>
              <h1 className="mb-4 text-2xl font-semibold text-white">
                Create New Report for @{data?.title}
              </h1>
              <div className="mb-4">
                <label className="mb-2 block text-white">
                  {capitalizeFirstLetter(data.paymentBasis)} since last report
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000000"
                  placeholder={`Enter ${data.paymentBasis.toLowerCase()} in $...`}
                  value={earnings}
                  onChange={(e) => {
                    const inputValue = parseFloat(e.target.value);
                    setEarnings(inputValue.toString());
                  }}
                  className="input w-full rounded bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-white">
                  Progress since last report
                </label>
                <TextArea
                  text={progress}
                  setText={setProgress}
                  placeHolder="Describe your progress..."
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-white">Future Plans</label>
                <TextArea
                  text={plans}
                  setText={setPlans}
                  placeHolder="Describe your future plans..."
                />
              </div>
            </>
          )}
          {page === 2 && (
            <div className="mb-72">
              <h1 className="mb-4 text-2xl font-semibold text-white">
                Pay {data?.investor?.fullName}
              </h1>
              <div className="flex items-center">
                <p className="mr-2">
                  You owe ${getAmountOwed(parseFloat(earnings), data)}
                </p>
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                >
                  Pay
                </button>
              </div>
            </div>
          )}
          <div className="mt-8 flex items-center justify-center">
            <button
              className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${
                page !== 1
                  ? "bg-blue-600 hover:cursor-pointer hover:bg-blue-700"
                  : "h-0 w-0 bg-blue-400"
              }`}
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <AiFillCaretLeft className="mr-1 h-6 w-6" />
            </button>
            <p className="mx-4 text-gray-300">Page {page} of 2</p>
            <button
              className={`flex h-8 w-8 items-center justify-center rounded-full  text-white ${
                earnings && progress && plans
                  ? "bg-blue-600 hover:cursor-pointer hover:bg-blue-700"
                  : "bg-blue-400"
              } ${page === 2 && "h-0 w-0"} `}
              onClick={() => setPage(page + 1)}
              disabled={page === 2 || !earnings || !progress || !plans}
            >
              <AiFillCaretRight className="ml-1 h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const investmentId = params?.id;

  if (typeof investmentId !== "string") throw new Error("no id");

  return {
    props: {
      investmentId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default CreateReportPage;
