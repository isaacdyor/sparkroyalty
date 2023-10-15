import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next/types";
import Loading from "~/components/conditionals/loading";
import InvalidID from "~/components/conditionals/invalidId";
import Link from "next/link";
import { capitalizeFirstLetter } from "~/utils/helperFunctions";

const ReportsPage: NextPage<{ investmentId: string; reportId: string }> = ({
  investmentId,
  reportId,
}) => {
  const { data, isLoading } = api.investments.getByInvestmentId.useQuery({
    id: investmentId,
  });

  const { data: reportData, isLoading: reportLoading } =
    api.reports.getOne.useQuery({
      reportId: reportId,
    });

  if (isLoading || reportLoading) return <Loading />;

  if (!data || !reportData) return <InvalidID />;

  return (
    <div className="flex justify-center ">
      <div className="mt-0 w-full max-w-6xl rounded p-6">
        <h1 className="mb-4 text-center text-3xl text-white"></h1>

        <div className="overflow-hidden rounded bg-secondary p-6 text-white">
          <div className="flex h-full flex-col">
            <div>
              <h2 className="mb-2 text-2xl font-semibold text-white">
                Report for{" "}
                <Link
                  className="hover:text-gray-400"
                  href={`/investments/${data.id}/reports`}
                >
                  {data.title}
                </Link>{" "}
                on {reportData.createdAt.toLocaleDateString()}
              </h2>

              <hr className="my-4 border-t-2 border-slate-600" />
              <p className="mb-3 text-gray-300">
                <span className="font-semibold">
                  {capitalizeFirstLetter(data.paymentBasis)}:
                </span>{" "}
                {reportData.earnings}
              </p>
              <p className="mb-3 text-gray-300">
                <span className="font-semibold">Progress:</span>{" "}
                {reportData.progress}
              </p>
              <p className="mb-3 text-gray-300">
                <span className="font-semibold">Plans:</span> {reportData.plans}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const investmentId = params?.id;
  const reportId = params?.reportId;

  if (typeof investmentId !== "string" || typeof reportId !== "string")
    throw new Error("no id");

  return {
    props: {
      investmentId,
      reportId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ReportsPage;
