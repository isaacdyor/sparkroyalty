import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import InvalidID from "~/components/conditionals/invalidId";
import Loading from "~/components/conditionals/loading";
import Unauthorized from "~/components/conditionals/unauthorized";
import { api } from "~/utils/api";

const ApplyPage: NextPage<{ id: string }> = ({ id }) => {
  const router = useRouter();

  const {
    data: applicationData,
    isLoading: applicationLoading,
    error: applicationError,
  } = api.applications.checkAlreadyExists.useQuery({
    investmentId: id,
  });

  const { data: investmentData, isLoading: investmentLoading } =
    api.investments.getByInvestmentId.useQuery({
      id,
    });

  const {
    data: investorData,
    isLoading: investorLoading,
    error: investorError,
  } = api.investors.getCurrent.useQuery();

  const [projectInterest, setProjectInterest] = useState("");
  const [projectSkills, setProjectSkills] = useState("");

  const { mutate } = api.applications.create.useMutation({
    onSuccess: async (data) => {
      sendNotification({
        subject: "New Application",
        content: `You just got a new application from ${investorData?.fullName}`,
        founderId: investmentData!.founderId,
        notificationType: "NEW_APPLICATION",
        link: `/applications/${data.id}`,
      });
      await router.push(`/applications/${data.id}`);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  const { mutate: sendNotification } =
    api.founderNotifications.create.useMutation({
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        console.error("Error creating investment:", errorMessage);
      },
    });

  if (applicationLoading || investmentLoading || investorLoading)
    return <Loading />;

  if (!investmentData) return <InvalidID />;

  if (applicationError ?? investorError) return <Unauthorized />;

  if (applicationData) {
    return (
      <div>
        <p>
          You have already applied to this investment. You can edit your
          application{" "}
          <Link
            href={`/applications/${applicationData.id}/edit`}
            className="text-blue-500 hover:text-blue-600"
          >
            here
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="m-6 w-full max-w-md rounded border border-slate-600 bg-black p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-white">
          Application for{" "}
          <Link
            href={`/investment/${investmentData.id}`}
            className="text-blue-500 hover:text-blue-600"
          >
            {investmentData.title}
          </Link>
        </h1>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-white">
            Why are you interested in this project?
          </label>
          <input
            type="text"
            value={projectInterest}
            onChange={(e) => setProjectInterest(e.target.value)}
            className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-white">
            What skills or experience do you have that would be useful for this
            project?
          </label>
          <input
            type="text"
            value={projectSkills}
            onChange={(e) => setProjectSkills(e.target.value)}
            className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            mutate({
              projectInterest,
              projectSkills,
              investmentId: id,
            });
          }}
          className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          Submit
        </button>
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

export default ApplyPage;
