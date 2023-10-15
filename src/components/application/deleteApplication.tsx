import router from "next/router";
import React from "react";
import { api } from "~/utils/api";

const DeleteApplication: React.FC<{ applicationId: string }> = ({
  applicationId,
}) => {
  const { mutate } = api.applications.delete.useMutation({
    onSuccess: async () => {
      await router.push("/applications");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });
  return (
    <button
      onClick={() => {
        mutate({
          applicationId,
        });
      }}
      className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
    >
      Delete
    </button>
  );
};

export default DeleteApplication;
