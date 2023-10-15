import { useUser } from "@clerk/nextjs";
import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import InvalidID from "~/components/conditionals/invalidId";
import Loading from "~/components/conditionals/loading";
import Unauthorized from "~/components/conditionals/unauthorized";
import { helpers } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const EditApplicationPage: NextPage<{
  applicationId: string;
}> = ({ applicationId }) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const { data, isLoading } = api.applications.getByApplicationId.useQuery({
    applicationId,
  });
  const [projectInterest, setProjectInterest] = useState(
    data?.projectInterest ?? ""
  );
  const [projectSkills, setProjectSkills] = useState(data?.projectSkills ?? "");

  const { mutate } = api.applications.update.useMutation({
    onSuccess: async (data) => {
      await router.push(`/applications/${data.id}`);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  if (isLoading || !isLoaded) return <Loading />;

  if (!data) return <InvalidID />;

  if (data.investorId != user?.id) return <Unauthorized />;

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="m-6 w-full max-w-md rounded border border-slate-600 bg-black p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-white">
          Application for {data.investment.title}
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
              applicationId: applicationId,
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
  const applicationId = params?.id;

  if (typeof applicationId !== "string") throw new Error("no id");

  await helpers.applications.getByApplicationId.prefetch({
    applicationId,
  });

  return {
    props: {
      applicationId,
      trpcState: helpers.dehydrate(),
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default EditApplicationPage;
