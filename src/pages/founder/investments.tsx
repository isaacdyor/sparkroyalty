import { api } from "~/utils/api";
import type { NextPage } from "next/types";
import Unauthorized from "~/components/conditionals/unauthorized";
import Loading from "~/components/conditionals/loading";
import CreateFounder from "~/components/conditionals/createFounder";
import InvestmentCard from "~/components/investment/investmentCard";
import { useEffect, useState } from "react";
import type { InvestmentType } from "~/types/types";
import { InvestmentStatusType } from "@prisma/client";

const FounderInvestmentPage: NextPage = () => {
  const { data, isLoading, error } = api.founders.getCurrent.useQuery();

  const [filter, setFilter] = useState<InvestmentStatusType>(
    InvestmentStatusType.PENDING
  );
  const [filteredData, setFilteredData] = useState<InvestmentType[]>([]);

  useEffect(() => {
    if (!data) return;
    const filteredInvestments = data.investments.filter((investment) => {
      console.log(investment.status + " " + filter);
      return investment.status.toLowerCase() === filter;
    });
    setFilteredData(filteredInvestments);
  }, [data, filter]);

  if (isLoading) return <Loading />;

  if (!data) return <CreateFounder />;

  if (error) return <Unauthorized />;

  return (
    <div className="flex min-h-screen justify-center bg-black">
      <div className="mt-4 w-full max-w-6xl ">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Your Investments
        </h1>
        <div className="flex items-center justify-end pr-10">
          <p className="mr-2">Type of investments:</p>
          <select
            className="rounded border border-gray-600 bg-black py-2 pl-1 text-white focus:outline-none"
            id="sortingDropdown"
            onChange={(e) => {
              setFilter(e.target.value as InvestmentStatusType);
            }}
          >
            <option className="bg-gray-800 text-white" value="pending">
              Pending
            </option>
            <option className="bg-gray-800 text-white" value="building">
              Building
            </option>
            <option className="bg-gray-800 text-blue-500" value="payout">
              Payout
            </option>
            <option className="bg-gray-800 text-blue-500" value="completed">
              Completed
            </option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {filteredData.length > 0 ? (
            data.investments.map((investment) => (
              <InvestmentCard key={investment.id} investment={investment} />
            ))
          ) : (
            <div className="text-center text-white">
              {data.investments.length === 0 ? (
                <>
                  <p className="text-2xl font-semibold">
                    You have no investments.
                  </p>
                  <p className="text-xl">
                    Click the button below to create one.
                  </p>
                </>
              ) : (
                <p className="text-2xl font-semibold">
                  You have no investments in the {filter.toLowerCase()} stage.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FounderInvestmentPage;
