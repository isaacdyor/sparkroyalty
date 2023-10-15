import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import router from "next/router";
import React from "react";
import { ActiveType, ProfileType, type UnsafeMetadata } from "~/types/types";
import { updateMetadata } from "~/utils/helperFunctions";

const SwitchProfileButton: React.FC<{
  profileType: ProfileType;
}> = ({ profileType }) => {
  const { user } = useUser();

  const switchProfile = () => {
    if (!user) {
      console.log("User is not defined");
      return;
    }
    let unsafeMetadata: UnsafeMetadata;

    if (profileType === ProfileType.FOUNDER) {
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
        if (profileType === ProfileType.FOUNDER) {
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
      {profileType === ProfileType.INVESTOR ? (
        user?.unsafeMetadata.founder ? (
          <button onClick={switchProfile}>
            <div className="rounded-t-lg p-4 text-center text-white hover:bg-slate-600">
              Switch to founder profile
            </div>
          </button>
        ) : (
          <button className="rounded-t-lg p-4 text-center text-white hover:bg-slate-600">
            <Link href="/founder/create">Create Founder Profile</Link>
          </button>
        )
      ) : user?.unsafeMetadata.investor ? (
        <button onClick={switchProfile}>
          <div className="rounded-t-lg p-4 text-center text-white hover:bg-slate-600">
            Switch to investor profile
          </div>
        </button>
      ) : (
        <button className="rounded-t-lg p-4 text-center text-white hover:bg-slate-600">
          <Link href="/investor/create">Create Investor Profile</Link>
        </button>
      )}
    </>
  );
};

export default SwitchProfileButton;
