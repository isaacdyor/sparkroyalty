import React from "react";
import { api } from "~/utils/api";
import type { InvestmentType } from "~/types/types";
import { NotificationClass } from "@prisma/client";

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

  const { mutate: sendNotification } = api.notifications.create.useMutation({
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
          notificationClass: NotificationClass.JOB_COMPLETE,
          link: `/investor/${investment.investorId}/review`,
        });
      }}
      className="w-full rounded-full bg-blue-500 p-1.5 font-semibold hover:bg-blue-600"
    >
      Complete
    </button>
  );
};

export default CompleteJobButton;
