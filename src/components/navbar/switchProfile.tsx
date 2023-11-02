import { useUser } from "@clerk/nextjs";
import { AccountType } from "@prisma/client";
import Link from "next/link";
import router from "next/router";
import React, { SetStateAction } from "react";
import { ActiveType, type UnsafeMetadata } from "~/types/types";
import { updateMetadata } from "~/utils/helperFunctions";

const SwitchProfileButton: React.FC<{
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
}> = ({ setIsModalOpen }) => {
  const { user } = useUser();

  const switchProfile = () => {
    if (!user) {
      console.log("User is not defined");
      return;
    }
    let unsafeMetadata: UnsafeMetadata;

    if (user.unsafeMetadata.active === AccountType.FOUNDER) {
      unsafeMetadata = {
        investor: user.unsafeMetadata.investor,
        founder: user.unsafeMetadata.founder,
        active: ActiveType.INVESTOR,
      };
    } else if (user.unsafeMetadata.active === AccountType.INVESTOR) {
      unsafeMetadata = {
        investor: user.unsafeMetadata.investor,
        founder: user.unsafeMetadata.founder,
        active: ActiveType.FOUNDER,
      };
    }

    updateMetadata(user, unsafeMetadata!)
      .then(async () => {
        await router.push("/profile");
      })
      .catch((err) => {
        console.error("Error updating metadata", err);
      });
  };
  console.log(user?.unsafeMetadata.active == ActiveType.FOUNDER);
  return (
    <>
      {user?.unsafeMetadata.active === AccountType.INVESTOR && (
        <>
          {user?.unsafeMetadata.founder ? (
            <button
              className="w-full"
              onClick={() => {
                switchProfile();
                setIsModalOpen(false);
              }}
            >
              <div className=" rounded-lg border border-white p-2 text-center text-white hover:bg-white hover:text-background">
                Switch to Founder
              </div>
            </button>
          ) : (
            <Link
              onClick={() => setIsModalOpen(false)}
              href="/founder/create"
              passHref
            >
              <div className="w-full rounded-lg border border-white p-2 text-center text-white hover:bg-white hover:text-background">
                Create Founder Profile
              </div>
            </Link>
          )}
        </>
      )}
      {user?.unsafeMetadata.active === AccountType.FOUNDER && (
        <>
          {user?.unsafeMetadata.investor ? (
            <button
              className="w-full"
              onClick={() => {
                switchProfile();
                setIsModalOpen(false);
              }}
            >
              <div className=" rounded-lg border border-white p-2 text-center text-white hover:bg-white hover:text-background">
                Switch to Investor
              </div>
            </button>
          ) : (
            <Link
              onClick={() => setIsModalOpen(false)}
              href="/investor/create"
              passHref
            >
              <div className="w-full rounded-lg border border-white p-1 text-center text-white hover:bg-white hover:text-background">
                Create Investor Profile
              </div>
            </Link>
          )}
        </>
      )}
    </>
  );
};

export default SwitchProfileButton;
