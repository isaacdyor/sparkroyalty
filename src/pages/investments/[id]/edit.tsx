import { useState } from "react";
import { api } from "~/utils/api";
import type { GetServerSideProps, NextPage } from "next/types";
import { useRouter } from "next/router";
import { helpers } from "~/server/helpers/ssgHelper";
import { useUser } from "@clerk/nextjs";
import Loading from "~/components/conditionals/loading";
import InvalidID from "~/components/conditionals/invalidId";
import Unauthorized from "~/components/conditionals/unauthorized";
import type { FrequencyType, PaymentBasisType } from "@prisma/client";
import InvestmentForm from "~/components/investment/investmentForm";
import Modal from "~/components/shared/modal";

const EditInvestmentPage: NextPage<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const { data, isLoading, error } = api.investments.getByInvestmentId.useQuery(
    { id }
  );

  console.log(data);

  const { mutate } = api.investments.update.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  const { mutate: deleteApplications } =
    api.applications.deleteByInvestmentId.useMutation({
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        console.error("Error creating investment:", errorMessage);
      },
    });

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
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
      investmentId: id,
    });
    deleteApplications({ investmentId: id });
    await router.push(`/investments/${id}`);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState(data!.title);
  const [description, setDescription] = useState(data!.description);
  const [workType, setWorkType] = useState(data!.workType);
  const [workDescription, setWorkDescription] = useState(data!.workDescription);
  const [skills, setSkills] = useState(
    data!.skills.map((skill) => skill.skill)
  );
  const [paymentBasis, setPaymentBasis] = useState<PaymentBasisType>(
    data!.paymentBasis
  );
  const [percent, setPercent] = useState(data!.percent.toString());
  const [totalPayout, setTotalPayout] = useState(data!.totalPayout.toString());
  const [payoutFrequency, setPayoutFrequency] = useState<FrequencyType>(
    data!.payoutFrequency
  );
  const [extraDetails, setExtraDetails] = useState(data!.extraDetails);

  if (isLoading || !isLoaded) return <Loading />;

  if (!data) return <InvalidID />;

  if (data.founderId != user?.id) return <Unauthorized />;

  if (error) return <Unauthorized />;

  return (
    <div className="flex flex-grow items-center justify-center bg-black p-4">
      <div className="w-full max-w-xl rounded border border-slate-600 bg-black p-6">
        <h1 className="mb-4 text-center text-3xl font-semibold text-white">
          Update Investment
        </h1>
        <hr className="my-4 border-t-2 border-slate-600" />
        <form>
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
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Save
          </button>
          {isModalOpen && (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                <div className="modal-content flex w-80 flex-col items-center rounded-lg bg-neutral-800 shadow-md">
                  <p className="px-4 pt-4 text-center">
                    Are you sure you want to edit your investment. This will
                    delete any existing applications for your investment.{" "}
                  </p>
                  <div className="flex justify-center p-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="text-white"
                    >
                      <div className="rounded-lg border border-neutral-500 p-2 text-center hover:bg-neutral-700">
                        Cancel
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        handleSubmit(e).catch((e) => {
                          console.error(e);
                        });
                      }}
                      className="text-white"
                    >
                      <div className="ml-2 rounded-lg bg-blue-500 p-2 text-center hover:bg-blue-600">
                        Confirm
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              ,
            </Modal>
          )}
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  if (typeof id !== "string") throw new Error("no id");

  await helpers.investments.getByInvestmentId.prefetch({ id });

  return {
    props: {
      id,
      trpcState: helpers.dehydrate(),
    },
  };
};

export default EditInvestmentPage;
