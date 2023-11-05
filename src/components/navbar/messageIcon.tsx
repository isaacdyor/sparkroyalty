import React, { useEffect } from "react";

import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useGeneralContext } from "~/utils/context";
import { useUser } from "@clerk/nextjs";
import { ActiveType, type ConversationType } from "~/types/types";

const MessageIcon = () => {
  const { conversations } = useGeneralContext();

  const { user, isLoaded } = useUser();
  let unreadConversations: ConversationType[] | undefined = [];

  const { unreadMessages, setUnreadMessages } = useGeneralContext();

  useEffect(() => {
    if (isLoaded) {
      const active = user?.unsafeMetadata.active;
      if (active == ActiveType.FOUNDER) {
        unreadConversations = conversations?.filter(
          (conversation) => conversation.founderSeen == false
        );
      } else if (active == user?.unsafeMetadata.active) {
        unreadConversations = conversations?.filter(
          (conversation) => conversation.investorSeen == false
        );
      }
      if (unreadConversations && unreadConversations.length > 0) {
        setUnreadMessages(true);
      } else {
        setUnreadMessages(false);
      }
    }
  }, [isLoaded, conversations]);

  return (
    <>
      {unreadMessages ? (
        <div className="relative">
          <Link href={"/messages"}>
            <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-muted-foreground " />
          </Link>
          <div className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 text-sm text-white" />
        </div>
      ) : (
        <Link href={"/messages"}>
          <ChatBubbleLeftEllipsisIcon className="h-7 w-7 text-muted-foreground " />
        </Link>
      )}
    </>
  );
};

export default MessageIcon;
