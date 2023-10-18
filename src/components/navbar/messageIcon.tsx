import React from "react";
import { api } from "~/utils/api";

import { AiFillMessage } from "react-icons/ai";
import Link from "next/link";

const MessageIcon = () => {
  const { data } = api.messages.getUnredConversations.useQuery();
  return (
    <>
      {data && data.length > 0 ? (
        <div className="relative">
          <Link href={"/messages"}>
            <AiFillMessage className="h-6 w-6 hover:cursor-pointer hover:text-foreground/70" />
          </Link>
          <div className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 text-sm text-white" />
        </div>
      ) : (
        <Link href={"/messages"}>
          <AiFillMessage className="h-6 w-6 hover:cursor-pointer hover:text-foreground/70" />
        </Link>
      )}
    </>
  );
};

export default MessageIcon;
