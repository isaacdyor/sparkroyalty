import React from "react";
import { api } from "~/utils/api";

const DeleteInvestmentButton: React.FC<{ investmentId: string }> = ({
  investmentId,
}) => {
  const ctx = api.useContext();

  const { mutate: deleteInvestment } = api.investments.delete.useMutation({
    onSuccess: () => {
      void ctx.founders.getCurrent.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });
  return (
    <button
      onClick={() => {
        deleteInvestment({
          investmentId,
        });
      }}
      className="rounded-full border border-blue-500 p-2 font-semibold text-blue-500 hover:bg-blue-500 hover:bg-opacity-10"
    >
      Delete
    </button>
  );
};

export default DeleteInvestmentButton;
