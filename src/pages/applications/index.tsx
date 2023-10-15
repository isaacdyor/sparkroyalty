import { api } from "~/utils/api";
import type { NextPage } from "next/types";
import Link from "next/link";
import Unauthorized from "~/components/conditionals/unauthorized";
import Loading from "~/components/conditionals/loading";
import type { ApplicationStatusType } from "@prisma/client";
import { useState } from "react";
import type { ApplicationType } from "~/types/types";

const ApplicationListPage: NextPage = () => {
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatusType>("PENDING");

  const { data, isLoading, error } =
    api.applications.getByInvestorId.useQuery();

  const { mutate } = api.applications.delete.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <Unauthorized />;

  if (!data) return null;

  const filterData = (
    statusInput: ApplicationStatusType
  ): ApplicationType[] => {
    return data.filter((item) => item.status === statusInput);
  };

  const FilteredData = filterData(applicationStatus);

  return (
    <div className="flex justify-center bg-black">
      <div className="mt-8 w-full max-w-6xl rounded border border-slate-600 p-6">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Your Open Applications
        </h1>
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => {
              setApplicationStatus("PENDING");
              filterData("PENDING");
            }}
            className={`${
              applicationStatus === "PENDING"
                ? "bg-blue-500"
                : "bg-gray-800 hover:bg-gray-700"
            } rounded-l px-4 py-2 font-bold text-white`}
          >
            Pending
          </button>
          <button
            onClick={() => {
              setApplicationStatus("ACCEPTED");
              filterData("ACCEPTED");
            }}
            className={`${
              applicationStatus === "ACCEPTED"
                ? "bg-blue-500"
                : "bg-gray-800 hover:bg-gray-700"
            } px-4 py-2 font-bold text-white`}
          >
            Accepted
          </button>
          <button
            onClick={() => {
              setApplicationStatus("REJECTED");
              filterData("REJECTED");
            }}
            className={`${
              applicationStatus === "REJECTED"
                ? "bg-blue-500"
                : "bg-gray-800 hover:bg-gray-700"
            } rounded-r px-4 py-2 font-bold text-white`}
          >
            Rejected
          </button>
        </div>

        {data.length === 0 ? (
          <div className="flex flex-col items-center">
            <p className="mb-4">No Applications</p>
            <Link href="/investments">Find a startup to invest in here</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {FilteredData.map((application) => (
              <div
                key={application.id}
                className="rounded bg-gray-800 p-6 text-white"
              >
                <Link href={`/applications/${application.id}`}>
                  <h2 className="mb-2 text-xl font-semibold">
                    {application.investor!.fullName}&apos;s application
                  </h2>
                </Link>

                <p>
                  <Link
                    className="hover:text-gray-400"
                    href={`/investments/${application.investment!.id}`}
                  >
                    Investment: {application.investment!.title}
                  </Link>
                </p>

                <p>Why I am interested: {application.projectInterest}</p>
                <p>What skills I have: {application.projectSkills}</p>
                <p>Status: {application.status}</p>
                {application.status === "PENDING" && (
                  <div>
                    <button className="mr-1 mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
                      <Link href={`/applications/${application.id}/edit`}>
                        Edit
                      </Link>
                    </button>
                    <button
                      onClick={() => {
                        mutate({
                          applicationId: application.id,
                        });
                      }}
                      className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
                {application.status === "REJECTED" && (
                  <div>
                    <button
                      onClick={() => {
                        mutate({
                          applicationId: application.id,
                        });
                      }}
                      className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                    >
                      Delete
                    </button>
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

export default ApplicationListPage;
