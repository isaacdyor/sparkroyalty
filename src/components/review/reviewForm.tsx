import { useUser } from "@clerk/nextjs";
import router from "next/router";
import React from "react";
import { api } from "~/utils/api";
import { NotificationClass, type AccountType } from "@prisma/client";
import ReviewInputs from "./reviewInputs";

interface ReviewFormProps {
  id: string;
  review: string;
  stars: number;
  revieweeType: AccountType;
  setReview: (newReview: string) => void;
  setStars: (newStars: number) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  id,
  review,
  stars,
  revieweeType,
  setReview,
  setStars,
}) => {
  const { user } = useUser();
  const { mutate: sendFounderNotification } =
    api.notifications.create.useMutation({
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        console.error("Error creatingnotification:", errorMessage);
      },
    });
  const { mutate: sendInvestorNotification } =
    api.notifications.create.useMutation({
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        console.error("Error sending notification:", errorMessage);
      },
    });

  const { mutate: reviewFounder } = api.reviews.reviewFounder.useMutation({
    onSuccess: async (data) => {
      sendFounderNotification({
        subject: "New Review",
        content: `${user?.fullName} just left a review on your profile`,
        founderId: id,
        notificationClass: NotificationClass.NEW_REVIEW,
        link: `/review/${data.id}`,
      });

      await router.push(`/review/${data.id}`);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  const { mutate: reviewInvestor } = api.reviews.reviewInvestor.useMutation({
    onSuccess: async (data) => {
      sendInvestorNotification({
        subject: "New Review",
        content: `${user?.fullName} just left a review on your profile`,
        investorId: id,
        notificationClass: NotificationClass.NEW_REVIEW,
        link: `/review/${data.id}`,
      });

      await router.push(`/review/${data.id}`);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  const createReview = () => {
    if (revieweeType === "FOUNDER") {
      reviewFounder({
        review,
        stars,
        founderId: id,
      });
    } else if (revieweeType === "INVESTOR") {
      reviewInvestor({
        review,
        stars,
        investorId: id,
      });
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createReview();
      }}
    >
      <ReviewInputs {...{ review, stars, setReview, setStars }} />
      <button className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default ReviewForm;
