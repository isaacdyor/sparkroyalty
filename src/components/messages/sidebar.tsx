import React, { useCallback, useEffect, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import MiniConversation from "./miniConversation";
import MessageSearchBar from "./searchBar";
import { useGeneralContext } from "~/utils/context";
import { ActiveType, ConversationType } from "~/types/types";
import { api } from "~/utils/api";
import { AccountType } from "@prisma/client";

const Sidebar: React.FC<{
  setNewConversation: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  active: ActiveType;
}> = ({ setNewConversation, setSidebarOpen, active }) => {
  const {
    selectedConversation,
    setSelectedConversation,
    conversations,
    setConversations,
  } = useGeneralContext();

  const [conversationSearch, setConversationSearch] = useState("");

  const filteredConversations = conversations?.filter((conversation) =>
    active === ActiveType.FOUNDER
      ? (conversation.investor?.fullName ?? conversation.investorName!)
          .toLowerCase()
          .includes(conversationSearch.toLowerCase())
      : (conversation.founder?.fullName ?? conversation.founderName!)
          .toLowerCase()
          .includes(conversationSearch.toLowerCase())
  );

  const miniConversationClick = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
    setNewConversation(false);
    setSidebarOpen(false);
  };

  const { mutate: markReadMutation } = api.messages.markRead.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating poopy profile:", errorMessage);
    },
  });

  // mark the conversation as read
  const markRead = useCallback(
    (conversationId: string) => {
      if (active === ActiveType.FOUNDER) {
        markReadMutation({
          conversationId: conversationId,
          accountType: AccountType.FOUNDER,
        });
        markReadState(conversationId, AccountType.FOUNDER);
      } else if (active === ActiveType.INVESTOR) {
        markReadMutation({
          conversationId: conversationId,
          accountType: AccountType.INVESTOR,
        });
        markReadState(conversationId, AccountType.INVESTOR);
      }
    },
    [active, markReadMutation]
  );

  // change state of conversation to read
  const markReadState = (conversationId: string, accountType: AccountType) => {
    setConversations((prevConversations) => {
      const prevConversationsArray = prevConversations ?? [];

      return prevConversationsArray.map((conversation) => {
        if (conversation.id === conversationId) {
          if (accountType === AccountType.FOUNDER) {
            return {
              ...conversation,
              founderSeen: true,
            };
          } else if (accountType === AccountType.INVESTOR) {
            return {
              ...conversation,
              investorSeen: true,
            };
          }
        }
        return conversation;
      });
    });
  };
  // mark the conversation as read when selected
  useEffect(() => {
    if (
      selectedConversation &&
      ((active === ActiveType.FOUNDER && !selectedConversation.founderSeen) ??
        (active === ActiveType.INVESTOR && !selectedConversation.investorSeen))
    ) {
      markRead(selectedConversation.id);
    }
  }, [selectedConversation, active, markRead]);

  return (
    <div className="flex flex-col border-r border-r-border">
      <div className="flex items-center justify-between border-b border-b-border py-1 pl-2">
        <p>Inbox</p>
        <div className="flex items-center pr-1">
          <div className="rounded-full p-2 hover:cursor-pointer hover:bg-secondary">
            <FaEllipsisH className="h-5 w-5 text-muted-foreground" />
          </div>
          <button
            className="rounded-full p-2 hover:bg-secondary"
            onClick={() => {
              setNewConversation(true);
              setSidebarOpen(false);
            }}
          >
            <IoCreateOutline className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="w-full border border-transparent border-b-border p-2 pt-2 ">
        <MessageSearchBar
          conversationSearch={conversationSearch}
          setConversationSearch={setConversationSearch}
        />
      </div>

      <div className="overflow-clip">
        {filteredConversations?.length === 0 && (
          <div className="flex w-64 flex-col items-center justify-center pt-2 text-center">
            <p className="text-muted-foreground">No conversations found</p>
            <p
              onClick={() => {
                setNewConversation(true);
                setSidebarOpen(false);
              }}
              className="pt-2 text-primary hover:cursor-pointer hover:text-primary/70"
            >
              Create one now
            </p>
          </div>
        )}
        {filteredConversations?.map((conversation) => {
          return (
            <div
              key={conversation.id}
              onClick={() => {
                miniConversationClick(conversation);
              }}
            >
              <MiniConversation
                conversation={conversation}
                selectedConversation={selectedConversation}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
