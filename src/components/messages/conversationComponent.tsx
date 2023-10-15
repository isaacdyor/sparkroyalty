import { useUser } from "@clerk/nextjs";
import { AccountType } from "@prisma/client";
import React, { useEffect, useRef } from "react";
import { ActiveType, type ConversationType } from "~/types/types";

const ConversationComponent: React.FC<{
  conversation: ConversationType;
}> = ({ conversation }) => {
  const { user } = useUser();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation.messages) {
      ref.current?.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    }
  }, [conversation.messages]);

  const sentByCurrentUser = (senderType: string | undefined) => {
    if (!senderType) return true;
    return (
      (senderType === AccountType.FOUNDER &&
        user?.unsafeMetadata.active === ActiveType.FOUNDER) ||
      (senderType === AccountType.INVESTOR &&
        user?.unsafeMetadata.active === ActiveType.INVESTOR)
    );
  };

  const differentTimeFrame = (index: number) => {
    const firstDate = conversation.messages![index - 1]?.createdAt;
    const secondDate = conversation.messages![index]?.createdAt;
    if (firstDate === undefined || secondDate === undefined) return true;
    const diffInMilliseconds = secondDate.getTime() - firstDate.getTime();

    return diffInMilliseconds > 3600000;
  };

  const formatDate = (uninitializedDate: Date): string => {
    const now = new Date();
    const date = new Date(uninitializedDate);
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return "Today";
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(
        date
      );
    } else {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear() % 100; // Get last 2 digits of the year
      return `${month}/${day}/${year}`;
    }
  };

  const formatTime = (uninitializedDate: Date): string => {
    const date = new Date(uninitializedDate);
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  return (
    <div>
      {conversation.messages ? (
        <div className="px-4">
          {conversation.messages.map((message, index) => (
            <div
              className={`${
                sentByCurrentUser(message.senderType) !==
                  sentByCurrentUser(
                    conversation.messages![index - 1]?.senderType
                  ) && "pt-2"
              }`}
              key={message.id}
            >
              {differentTimeFrame(index) && (
                <div
                  className={`flex justify-center pb-1 ${
                    index !== 0 ? "pt-6" : "pt-2"
                  } text-xs text-muted-foreground`}
                >
                  <p className="pr-1 font-semibold">
                    {formatDate(message.createdAt)}
                  </p>
                  <p>{formatTime(message.createdAt)}</p>
                </div>
              )}
              <div
                className={`mt-0.5 flex ${
                  sentByCurrentUser(message.senderType)
                    ? "justify-end"
                    : "justify-start"
                } `}
              >
                <div
                  className={`flex w-3/4 ${
                    sentByCurrentUser(message.senderType)
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <p
                    className={`inline-block break-all rounded-2xl px-2 py-1 ${
                      sentByCurrentUser(message.senderType)
                        ? " bg-primary"
                        : "bg-secondary"
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div ref={ref} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ConversationComponent;
