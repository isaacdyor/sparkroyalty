import { api } from "~/utils/api";
import type { GetServerSideProps, NextPage } from "next/types";
import Loading from "~/components/conditionals/loading";
import type { InvestmentType } from "~/types/types";
import { useRouter } from "next/router";
import { getLength, investmentSort } from "~/utils/investmentSearch";
import { getAuth } from "@clerk/nextjs/server";
import { helpers } from "~/server/helpers/ssgHelper";
import { useEffect, useState } from "react";
import InvestmentCard from "~/components/investment/investmentCard";
import PageNav from "~/components/shared/pageNav";

enum SortingMethod {
  Relevance = "relevance",
  Latest = "latest",
  Payout = "payout",
}

const InvestmentPage: NextPage<{ userId: string }> = ({ userId }) => {
  const { data, isLoading } = api.investments.getPending.useQuery();

  const { data: userData, isLoading: userLoading } =
    api.investors.getOne.useQuery({ investorId: userId });

  const router = useRouter();
  const query = router.query.query as string;

  const [sortMethod, setSortMethod] = useState<SortingMethod>(
    SortingMethod.Relevance
  );
  const [orderedData, setOrderedData] = useState<InvestmentType[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (userData) {
      setOrderedData(investmentSort(data!, query, sortMethod, page, userData));
    } else {
      setOrderedData(investmentSort(data!, query, sortMethod, page));
    }
  }, [sortMethod, userData, query, data, page]);

  if (isLoading || userLoading) return <Loading />;

  return (
    <div className="flex justify-center ">
      <div className="mt-0 w-full max-w-6xl rounded p-6">
        {query ? (
          <h1 className="mb-4 text-center text-3xl text-white">
            Results for <span className="font-semibold">{query}</span>
          </h1>
        ) : (
          <h1 className="mb-4 text-center text-3xl text-white">Investments</h1>
        )}

        <div className="mx-4 mb-4 flex items-center justify-between">
          <p>Number of results: {getLength(data!, query) ?? 0} </p>
          <div className="flex items-center">
            <p className="mr-2">Sort by: </p>
            <select
              className="rounded border border-gray-600 bg-background py-2 pl-1 text-white focus:outline-none"
              id="sortingDropdown"
              onChange={(e) => {
                setSortMethod(e.target.value as SortingMethod);
              }}
            >
              <option className="bg-gray-800 text-white" value="relevance">
                Relevance
              </option>
              <option className="bg-gray-800 text-white" value="latest">
                Latest
              </option>
              <option className="bg-gray-800 text-blue-500" value="payout">
                Payout
              </option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {orderedData?.map((investment) => (
            <InvestmentCard key={investment.id} investment={investment} />
          ))}
        </div>
        <PageNav
          page={page}
          setPage={setPage}
          totalPages={Math.ceil(getLength(data!, query) / 30)}
        />
      </div>
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

  await helpers.investors.getOne.prefetch({ investorId: userId });
  await helpers.investments.getPending.prefetch();

  return {
    props: {
      userId,
      trpcState: helpers.dehydrate(),
    },
  };
};

export default InvestmentPage;
