import { useUser } from "@clerk/nextjs";
import { AccountType } from "@prisma/client";
import Link from "next/link";
import router from "next/router";
import React from "react";
import { ActiveType, type UnsafeMetadata } from "~/types/types";
import { updateMetadata } from "~/utils/helperFunctions";

const SwitchProfileButton: React.FC<{
  accountType: AccountType;
}> = ({ accountType }) => {
  const { user } = useUser();

  const switchProfile = () => {
    if (!user) {
      console.log("User is not defined");
      return;
    }
    let unsafeMetadata: UnsafeMetadata;

    if (accountType === AccountType.FOUNDER) {
      unsafeMetadata = {
        investor: user.unsafeMetadata.investor,
        founder: user.unsafeMetadata.founder,
        active: ActiveType.INVESTOR,
      };
    } else {
      unsafeMetadata = {
        investor: user.unsafeMetadata.investor,
        founder: user.unsafeMetadata.founder,
        active: ActiveType.FOUNDER,
      };
    }

    updateMetadata(user, unsafeMetadata)
      .then(async () => {
        if (accountType === AccountType.FOUNDER) {
          await router.push("/investor");
        } else {
          await router.push("/founder");
        }
      })
      .catch((err) => {
        console.error("Error updating metadata", err);
      });
  };
  return (
    <>
      {accountType === AccountType.INVESTOR
        ? user?.unsafeMetadata.founder && (
            <button onClick={switchProfile}>
              <div className="text-muted-foreground">
                Switch to founder profile
              </div>
            </button>
          )
        : user?.unsafeMetadata.investor && (
            <button onClick={switchProfile}>
              <div className="text-muted-foreground">Switch to Investing</div>
            </button>
          )}
    </>
  );
};

export default SwitchProfileButton;
