import React from "react";
import {
  ActiveType,
  type ConversationType,
  type FounderType,
  type InvestorType,
} from "~/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@clerk/nextjs";

interface SuggestionType {
  id: string;
  fullName: string;
  imageUrl: string;
  email: string;
}

interface UserSuggestionProps {
  founderSuggestions: FounderType[] | null;
  investorSuggestions: InvestorType[] | null;
  userSearch: string;
  newConversationUser: SuggestionType | null;
  setNewConversationUser: React.Dispatch<
    React.SetStateAction<SuggestionType | null>
  >;
  conversations: ConversationType[] | null;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<ConversationType | null>
  >;
  setNewConversation: React.Dispatch<React.SetStateAction<boolean>>;
  newMessageRef: React.RefObject<HTMLInputElement>;
}

const UserSuggestions: React.FC<UserSuggestionProps> = ({
  founderSuggestions,
  investorSuggestions,
  userSearch,
  newConversationUser,
  setNewConversationUser,
  conversations,
  setSelectedConversation,
  setNewConversation,
  newMessageRef,
}) => {
  const { user } = useUser();
  if (!user) return null;
  let suggestions: SuggestionType[] = [];
  if (founderSuggestions) {
    suggestions = founderSuggestions;
  } else if (investorSuggestions) {
    suggestions = investorSuggestions;
  }

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const conversationExists = (suggestion: SuggestionType) => {
    const exists = conversations!.some((conversation) => {
      if (user.unsafeMetadata.active === ActiveType.FOUNDER) {
        return conversation.investorId === suggestion.id;
      } else if (user.unsafeMetadata.active === ActiveType.INVESTOR) {
        return conversation.founderId === suggestion.id;
      }
    });
    return exists;
  };

  const getConversation = (userId: string) => {
    const conversation = conversations!.find((conversation) => {
      if (user.unsafeMetadata.active === ActiveType.FOUNDER) {
        return conversation.investorId === userId;
      } else if (user.unsafeMetadata.active === ActiveType.INVESTOR) {
        return conversation.founderId === userId;
      }
    });
    return conversation;
  };

  return (
    <div className="">
      {!newConversationUser && (
        <>
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex w-full items-center border-b p-2 hover:cursor-pointer hover:bg-secondary"
              onClick={() => {
                if (!conversationExists(suggestion)) {
                  setNewConversationUser(suggestion);
                } else {
                  setSelectedConversation(getConversation(suggestion.id)!);
                  setNewConversation(false);
                  setNewConversationUser(null);
                }
                newMessageRef.current?.focus();
              }}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={suggestion.imageUrl} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate pl-2">
                <p className="">{suggestion.fullName}</p>
                <p className="">{suggestion.email}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default UserSuggestions;
