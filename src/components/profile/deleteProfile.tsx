import { useUser } from "@clerk/nextjs";
import { AccountType } from "@prisma/client";
import router from "next/router";
import React from "react";
import { ActiveType, type UnsafeMetadata } from "~/types/types";
import { api } from "~/utils/api";
import { updateMetadata } from "~/utils/helperFunctions";

const DeleteProfileButton: React.FC<{ accountType: AccountType }> = ({
  accountType,
}) => {
  const { user } = useUser();

  const profileApi =
    accountType === AccountType.FOUNDER ? api.founders : api.investors;

  const { mutate } = profileApi.delete.useMutation({
    onSuccess: async () => {
      await router.push("/");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error deleting profile:", errorMessage);
    },
  });

  const deleteFounder = () => {
    if (!user) {
      console.log("User is not defined");
      return;
    }

    let unsafeMetadata: UnsafeMetadata;
    if (accountType === AccountType.FOUNDER) {
      unsafeMetadata = {
        investor: user.unsafeMetadata.investor,
        founder: false,
        active: ActiveType.NONE,
      };
    } else {
      unsafeMetadata = {
        investor: false,
        founder: user.unsafeMetadata.founder,
        active: ActiveType.NONE,
      };
    }
    updateMetadata(user, unsafeMetadata).catch((err) => {
      console.error("Error updating metadata", err);
    });
    mutate();
  };

  return (
    <>
      <button
        onClick={deleteFounder}
        className="border-b border-t border-slate-400 p-4 text-center text-white hover:bg-slate-600"
      >
        Delete Profile
      </button>
    </>
  );
};

export default DeleteProfileButton;
