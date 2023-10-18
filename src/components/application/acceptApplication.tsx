import router from "next/router";
import React from "react";
import { api } from "~/utils/api";
import type { InvestmentType } from "~/types/types";
import { NotificationClass } from "@prisma/client";

const AcceptApplication: React.FC<{
  investment: InvestmentType;
  applicationId: string;
}> = ({ investment, applicationId }) => {
  const { mutate: mutateApplication } = api.applications.setStatus.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  const { mutate: mutateInvestment } =
    api.investments.acceptApplication.useMutation({
      onSuccess: async (data) => {
        await router.push(`/investments/${data.id}`);
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

  const acceptApplication = (applicationId: string) => {
    if (!investment.applications) return null;
    investment.applications.forEach((application) => {
      if (application.id === applicationId) {
        mutateApplication({ id: applicationId, status: "ACCEPTED" });
        mutateInvestment({
          investmentId: investment.id,
          investorId: application.investorId,
        });
        sendNotification({
          subject: "Your application has been accepted",
          content: `Your application for ${investment.title} has been accepted`,
          investorId: application.investorId,
          notificationClass: NotificationClass.APP_ACCEPTED,
          link: `/investments/${investment.id}`,
        });
      } else {
        mutateApplication({ id: application.id, status: "REJECTED" });
        sendNotification({
          subject: "Your application has been rejected",
          content: `Your application for ${investment.title} has been rejected`,
          investorId: application.investorId,
          notificationClass: NotificationClass.APP_ACCEPTED,
        });
      }
    });
  };
  return (
    <button
      className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
      onClick={() => acceptApplication(applicationId)}
    >
      Accept
    </button>
  );
};

export default AcceptApplication;
