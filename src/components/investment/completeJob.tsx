import React from "react";
import { api } from "~/utils/api";
import type { InvestmentType } from "~/types/types";

const CompleteJobButton: React.FC<{
  investment: InvestmentType;
}> = ({ investment }) => {
  const { mutate: completeJob } = api.investments.completeJob.useMutation({
    onSuccess: () => {
      window.location.reload();
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

  return (
    <button
      onClick={() => {
        completeJob({
          investmentId: investment.id,
        });
        sendNotification({
          subject: "Your job has been completed",
          content: `${investment.title} has been completed by ${
            investment.investor!.fullName
          }`,
          founderId: investment.founderId,
          notificationType: "JOB_COMPLETE",
          link: `/investor/${investment.investorId}/review`,
        });
      }}
      className="w-full rounded-full bg-blue-500 p-2 font-semibold hover:bg-blue-600"
    >
      Complete Job
    </button>
  );
};

export default CompleteJobButton;
