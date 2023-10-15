import { useState } from "react";
import { api } from "~/utils/api";
import type { NextPage } from "next/types";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Unauthorized from "~/components/conditionals/unauthorized";
import { ActiveType } from "~/types/types";
import { PaymentBasisType } from "@prisma/client";
import { FrequencyType } from "@prisma/client";
import InvestmentForm from "~/components/investment/investmentForm";

const NewInvestment: NextPage = () => {
  const router = useRouter();
  const { mutate } = api.investments.create.useMutation({
    onSuccess: async (data) => {
      await router.push(`/investments/${data.id}`);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workType, setWorkType] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([""]);
  const [paymentBasis, setPaymentBasis] = useState<PaymentBasisType>(
    PaymentBasisType.REVENUE
  );
  const [percent, setPercent] = useState("");
  const [totalPayout, setTotalPayout] = useState("");
  const [payoutFrequency, setPayoutFrequency] = useState<FrequencyType>(
    FrequencyType.MONTHLY
  );
  const [extraDetails, setExtraDetails] = useState("");

  if (user?.unsafeMetadata.active !== ActiveType.FOUNDER)
    return <Unauthorized />;

  return (
    <div className="flex flex-grow items-center justify-center bg-black p-4">
      <div className="w-full max-w-xl rounded border border-slate-600 bg-black p-6">
        <h1 className="mb-4 text-center text-3xl font-semibold text-white">
          Create New Investment
        </h1>
        <hr className="my-4 border-t-2 border-slate-600" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate({
              title,
              description,
              workType,
              workDescription,
              skills,
              paymentBasis,
              percent: parseFloat(percent),
              totalPayout: parseFloat(totalPayout),
              payoutFrequency,
              extraDetails,
            });
          }}
        >
          <InvestmentForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            workType={workType}
            setWorkType={setWorkType}
            workDescription={workDescription}
            setWorkDescription={setWorkDescription}
            skills={skills}
            setSkills={setSkills}
            paymentBasis={paymentBasis}
            setPaymentBasis={setPaymentBasis}
            percent={percent}
            setPercent={setPercent}
            totalPayout={totalPayout}
            setTotalPayout={setTotalPayout}
            setPayoutFrequency={setPayoutFrequency}
            extraDetails={extraDetails}
            setExtraDetails={setExtraDetails}
          />
          <button
            type="submit"
            className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewInvestment;
