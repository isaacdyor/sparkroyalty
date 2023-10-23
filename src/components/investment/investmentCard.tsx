import React from "react";
import type { InvestmentType } from "~/types/types";
import EditInvestmentButton from "./editInvestment";
import DeleteInvestmentButton from "./deleteInvestment";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ActiveType } from "~/types/types";
import { sliceDescription } from "~/utils/helperFunctions";

const InvestmentCard: React.FC<{ investment: InvestmentType }> = ({
  investment,
}) => {
  const { user } = useUser();

  const alreadyApplied = investment.applications?.some(
    (application) => application.investorId === user?.id
  );

  return (
    <div className="overflow-hidden rounded bg-secondary p-6 text-white">
      <div className="flex h-full flex-col">
        <div>
          <h2 className="mb-2 text-2xl font-semibold text-white ">
            <Link
              className="hover:text-gray-400"
              href={`/investments/${investment.id}`}
            >
              {investment.title}
            </Link>
          </h2>

          <p className="mb-3 text-gray-300">
            <span className="font-semibold">Description:</span>{" "}
            {sliceDescription(investment.description)}
          </p>
          <hr className="my-4 border-t-2 border-slate-600" />
          <p className="mb-3 text-gray-300">
            <span className="font-semibold">Work Type:</span>{" "}
            {investment.workType}
          </p>
          <div className="mb-3 text-gray-300">
            <span className="font-semibold">Suggested Skills:</span>
            <div className="mt-2 flex flex-wrap ">
              {investment.skills?.map((skill) => (
                <p
                  className="mb-1 mr-1 rounded-2xl border border-gray-600 bg-gray-700 p-1 px-2" // Add margin to create spacing between skills
                  key={skill.id}
                >
                  {skill.skill}
                </p>
              ))}
            </div>
          </div>
        </div>

        {investment.founderId === user?.id &&
          user.unsafeMetadata.active === ActiveType.FOUNDER && (
            <>
              {investment.status === "PENDING" && (
                <div>
                  <hr className="my-4 border-t-2 border-slate-600" />
                  <Link
                    className="text-blue-500 hover:text-blue-600"
                    href={`/investments/${investment.id}/applications`}
                  >
                    View Applications
                  </Link>
                  <div className="mt-4 flex justify-center">
                    <div className="pr-2">
                      <EditInvestmentButton investmentId={investment.id} />
                    </div>
                    <DeleteInvestmentButton investmentId={investment.id} />
                  </div>
                </div>
              )}
            </>
          )}
        {user?.unsafeMetadata.active === ActiveType.INVESTOR &&
          !alreadyApplied && (
            <>
              {investment.status === "PENDING" && (
                <div>
                  <hr className="my-4 border-t-2 border-slate-600" />
                  <Link
                    className="text-blue-500 hover:text-blue-600"
                    href={`/investments/${investment.id}/apply`}
                  >
                    <button className="rounded-full bg-primary p-2 px-4 text-white">
                      Apply
                    </button>
                  </Link>
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
};

export default InvestmentCard;
