import router from "next/router";
import React from "react";
import { api } from "~/utils/api";

const DeleteReviewButton: React.FC<{ reviewId: string }> = ({ reviewId }) => {
  const { mutate: deleteReview } = api.reviews.delete.useMutation({
    onSuccess: async () => {
      await router.push("/");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        deleteReview({
          reviewId,
        });
      }}
      className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
    >
      Delete
    </button>
  );
};

export default DeleteReviewButton;
