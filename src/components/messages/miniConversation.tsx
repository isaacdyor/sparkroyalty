import { useUser } from "@clerk/nextjs";
import React from "react";
import { ActiveType, type ConversationType } from "~/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const MiniConversation: React.FC<{
  conversation: ConversationType;
  selectedConversation: ConversationType | null;
}> = ({ conversation, selectedConversation }) => {
  const { user } = useUser();

  function formatDate(uninitializedDate: Date): string {
    const now = new Date();
    const date = new Date(uninitializedDate);
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date);
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
  }

  if (!user) return null;

  const isUnseen =
    (user.unsafeMetadata.active === ActiveType.FOUNDER &&
      !conversation.founderSeen) ??
    (user.unsafeMetadata.active === ActiveType.INVESTOR &&
      !conversation.investorSeen);

  if (!conversation.messages) return null;
  const recentMessage = conversation.messages[conversation.messages.length - 1];

  return (
    <div
      key={conversation.id}
      className={`flex w-full min-w-[250px] items-center border border-l-4 sm:max-w-[400px]  ${
        conversation.id === selectedConversation?.id && "border-l-primary"
      } border-transparent border-b-border  py-1 pr-3 hover:cursor-pointer hover:bg-secondary`}
    >
      <div
        className={`mr-1.5 h-3.5 w-3.5 flex-shrink-0 rounded-full ${
          isUnseen && "bg-primary"
        }`}
      />
      <div className="flex grow items-center">
        <Avatar>
          <AvatarImage
            src={
              user.unsafeMetadata.active === ActiveType.FOUNDER
                ? conversation.investor?.imageUrl ??
                  conversation.investorImageUrl
                : conversation.founder?.imageUrl ?? conversation.founderImageUrl
            }
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="ml-2 flex grow flex-col">
          <div className="flex justify-between">
            {user.unsafeMetadata.active === ActiveType.FOUNDER && (
              <p className="line-clamp-1 break-all">
                {conversation.investor?.fullName ?? conversation.investorName}
              </p>
            )}
            {user.unsafeMetadata.active === ActiveType.INVESTOR && (
              <p className="line-clamp-1 break-all">
                {conversation.founder?.fullName ?? conversation.founderName}
              </p>
            )}
            {recentMessage && (
              <p className="whitespace-nowrap pl-1 text-muted-foreground">
                {formatDate(recentMessage.createdAt)}
              </p>
            )}
          </div>

          {recentMessage && (
            <p className="line-clamp-2 h-12 break-all text-muted-foreground">
              {recentMessage.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniConversation;
