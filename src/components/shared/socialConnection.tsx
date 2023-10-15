import React from "react";
import type { ExternalAccountResource } from "@clerk/types";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { GrLinkedin } from "react-icons/gr";
import { AiFillGithub } from "react-icons/ai";
import { SiDiscord } from "react-icons/si";
import { capitalizeFirstLetter } from "~/utils/helperFunctions";

const SocialConnection: React.FC<{ account: ExternalAccountResource }> = ({
  account,
}) => {
  let icon;
  switch (account.provider) {
    case "google":
      icon = <FcGoogle className="h-6 w-6" />;
      break;
    case "github":
      icon = <AiFillGithub className="h-6 w-6" />;
      break;
    case "discord":
      icon = <SiDiscord className="h-6 w-6 text-[#5865F2]" />;
      break;
    case "linkedin":
      icon = (
        <div className="rounded-lg bg-white">
          <GrLinkedin className="relative h-6 w-6 rounded-lg text-[#0b65c2]" />
        </div>
      );
      break;
    case "facebook":
      icon = (
        <div className="rounded-xl bg-white">
          <BsFacebook className=" h-6 w-6 text-[#1877F2]" />
        </div>
      );
      break;
  }

  return (
    <div className="my-1 flex items-center">
      {icon}
      <span className="ml-2">{capitalizeFirstLetter(account.provider)}</span>
    </div>
  );
};

export default SocialConnection;
