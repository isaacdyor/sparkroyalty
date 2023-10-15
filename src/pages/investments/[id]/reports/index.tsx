import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next/types";
import Loading from "~/components/conditionals/loading";
import InvalidID from "~/components/conditionals/invalidId";
import Link from "next/link";
import { capitalizeFirstLetter } from "~/utils/helperFunctions";

const ReportsPage: NextPage<{ investmentId: string }> = ({ investmentId }) => {
  const { data, isLoading } = api.investments.getByInvestmentId.useQuery({
    id: investmentId,
  });

  if (isLoading) return <Loading />;

  if (!data) return <InvalidID />;

  return (
    <div className="flex justify-center ">
      <div className="mt-0 w-full max-w-6xl rounded p-6">
        <h1 className="mb-4 text-center text-3xl text-white">
          Reports for {data.title}
        </h1>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.reports.map((report) => (
            <div
              className="overflow-hidden rounded bg-secondary p-6 text-white"
              key={report.id}
            >
              <div className="flex h-full flex-col">
                <div>
                  <h2 className="mb-2 text-2xl font-semibold text-white ">
                    <Link
                      className="hover:text-gray-400"
                      href={`/investments/${data.id}/reports/${report.id}`}
                    >
                      {report.createdAt.toLocaleDateString()}
                    </Link>
                  </h2>
                  <hr className="my-4 border-t-2 border-slate-600" />
                  <p className="mb-3 text-gray-300">
                    <span className="font-semibold">
                      {capitalizeFirstLetter(data.paymentBasis)}:
                    </span>{" "}
                    {report.earnings}
                  </p>
                  <p className="mb-3 text-gray-300">
                    <span className="font-semibold">Progress:</span>{" "}
                    {report.progress}
                  </p>
                  <p className="mb-3 text-gray-300">
                    <span className="font-semibold">Plans:</span> {report.plans}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default ReportsPage;
