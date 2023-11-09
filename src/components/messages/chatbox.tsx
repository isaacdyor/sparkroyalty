import React, { useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { FaEllipsisH } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import {
  ActiveType,
  ConversationType,
  MessageType,
  SuggestionType,
} from "~/types/types";
import ConversationComponent from "./conversationComponent";
import UserSuggestions from "./userSuggestions";
import { BiArrowBack } from "react-icons/bi";
import { useGeneralContext } from "~/utils/context";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { nanoid } from "nanoid";
import { AccountType } from "@prisma/client";

const Chatbox: React.FC<{
  newConversation: boolean;
  isBigScreen: boolean;
  setNewConversation: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  active: ActiveType;
  inputRef: React.RefObject<HTMLInputElement>;
  newMessageRef: React.RefObject<HTMLInputElement>;
}> = ({
  newConversation,
  setNewConversation,
  setSidebarOpen,
  isBigScreen,
  active,
  inputRef,
  newMessageRef,
}) => {
  const { user } = useUser();

  // mutations
  const { mutate: createConversationMutation } =
    api.messages.createConversation.useMutation({
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        console.error("Error updating poopy profile:", errorMessage);
      },
    });

  const { mutate: markReadMutation } = api.messages.markRead.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating poopy profile:", errorMessage);
    },
  });

  const { mutate: markNotReadMutation } = api.messages.markNotRead.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating poopy profile:", errorMessage);
    },
  });

  const { mutate: sendMessageMutation } = api.messages.sendMessage.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating poopy profile:", errorMessage);
    },
  });
  // state
  const {
    conversations,
    selectedConversation,
    setConversations,
    setSelectedConversation,
  } = useGeneralContext();

  const [conversationSearch, setConversationSearch] = useState("");

  const [message, setMessage] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const [newConversationUser, setNewConversationUser] =
    useState<SuggestionType | null>(null);

  // queries
  const { data: investors } = api.investors.getAll.useQuery(undefined, {
    enabled: active === ActiveType.FOUNDER,
  });

  const { data: founders } = api.founders.getAll.useQuery(undefined, {
    enabled: active === ActiveType.INVESTOR,
  });
  // create conversation
  const createConversation = () => {
    if (!message || !newConversationUser) return;
    createConversationMutation({
      content: message,
      recipientId: newConversationUser.id,
      senderName: user!.fullName!,
      senderImageUrl: user!.imageUrl,
    });
    newConversationSender();
    setNewConversation(false);
    setNewConversationUser(null);
  };

  const newConversationSender = () => {
    if (!newConversationUser) return;
    let newConversation: ConversationType;
    if (active === ActiveType.FOUNDER) {
      newConversation = {
        id: nanoid(),
        createdAt: new Date(),

        lastMessageAt: new Date(),
        founderSeen: true,
        investorSeen: false,
        founderId: user!.id,
        investorId: newConversationUser.id,
        investorName: newConversationUser.fullName,
        investorImageUrl: newConversationUser.imageUrl,
        messages: [
          {
            content: message,
            createdAt: new Date(),
            id: nanoid(),
            investorId: newConversationUser.id,
            founderId: user!.id,
            senderType: AccountType.FOUNDER,
            conversationId: nanoid(),
            senderName: user!.fullName!,
          },
        ],
      };
    } else if (active === ActiveType.INVESTOR) {
      newConversation = {
        id: nanoid(),
        createdAt: new Date(),

        lastMessageAt: new Date(),
        founderSeen: true,
        investorSeen: false,
        founderId: newConversationUser.id,
        investorId: user!.id,
        founderName: newConversationUser.fullName,
        founderImageUrl: newConversationUser.imageUrl,
        messages: [
          {
            content: message,
            createdAt: new Date(),
            id: nanoid(),
            investorId: user!.id,
            founderId: newConversationUser.id,
            senderType: AccountType.INVESTOR,
            conversationId: nanoid(),
            senderName: user!.fullName!,
          },
        ],
      };
    }
    setConversations((prevConversations) => {
      const prevConversationsArray = prevConversations ?? [];

      return [newConversation, ...prevConversationsArray];
    });
    setSelectedConversation(newConversation!);
  };

  // send the message
  const sendMessage = () => {
    if (!message || !selectedConversation) return;
    updateSenderMessages();
    sendMessageMutation({
      content: message,
      recipientId:
        active === ActiveType.INVESTOR
          ? selectedConversation.founderId
          : selectedConversation.investorId,
      conversation: selectedConversation,
      imageUrl: user!.imageUrl,
      senderName: user!.fullName!,
    });
  };

  // get the message for the sender
  const updateSenderMessages = () => {
    if (!selectedConversation) return;
    let newMessage: MessageType;
    if (active === ActiveType.FOUNDER) {
      newMessage = {
        content: message,
        createdAt: new Date(),
        id: nanoid(),
        investorId: selectedConversation?.investorId,
        founderId: selectedConversation?.founderId,
        senderType: AccountType.FOUNDER,
        senderName: user!.fullName!,
        conversationId: selectedConversation?.id,
      };
    } else if (active === ActiveType.INVESTOR) {
      newMessage = {
        content: message,
        createdAt: new Date(),
        id: nanoid(),
        investorId: selectedConversation?.investorId,
        founderId: selectedConversation?.founderId,
        senderType: AccountType.INVESTOR,
        senderName: user!.fullName!,
        conversationId: selectedConversation?.id,
      };
    }
    setConversations((prevConversations) => {
      const prevConversationsArray = prevConversations ?? [];

      return prevConversationsArray.map((conversation) => {
        if (conversation.id === newMessage.conversationId) {
          return {
            ...conversation,
            lastMessageAt: new Date(),
            messages: [...conversation.messages!, newMessage],
          };
        }
        return conversation;
      });
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior (e.g., form submission)
      if (newConversation) {
        createConversation();
      } else {
        sendMessage();
      }
      setMessage("");
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-clip rounded-lg">
      <div className="flex items-center justify-between border-b border-b-border px-2 py-1">
        {newConversation ? (
          newConversationUser ? (
            <div
              className="my-1 flex items-center rounded-full bg-primary p-0.5 px-2 hover:cursor-pointer hover:bg-primary/70"
              onClick={() => {
                setNewConversationUser(null);
                setUserSearch("");
              }}
            >
              <p className="pr-1">{newConversationUser.fullName}</p>

              <RxCross2 className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex w-full py-0.5">
              {!isBigScreen && (
                <div className="mr-1 rounded-full p-2 hover:cursor-pointer hover:bg-secondary">
                  <BiArrowBack
                    className="h-5 w-5 text-neutral-300"
                    onClick={() => setSidebarOpen(true)}
                  />
                </div>
              )}
              <input
                className="w-full rounded-full border-2 border-input bg-background px-1 py-1 pl-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Search Email..."
                ref={inputRef}
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                }}
              />
            </div>
          )
        ) : (
          <>
            <div className="flex items-center">
              {!isBigScreen && (
                <div className="mr-1 rounded-full p-2 hover:cursor-pointer hover:bg-secondary">
                  <BiArrowBack
                    className="h-5 w-5 text-neutral-300"
                    onClick={() => setSidebarOpen(true)}
                  />
                </div>
              )}
              {active === ActiveType.FOUNDER ? (
                <p>
                  {selectedConversation?.investor?.fullName ??
                    selectedConversation?.investorName}
                </p>
              ) : (
                <p>
                  {selectedConversation?.founder?.fullName ??
                    selectedConversation?.founderName}
                </p>
              )}
            </div>

            <div className="flex items-center pr-1">
              <div className="rounded-full p-2 hover:cursor-pointer hover:bg-secondary">
                <FaEllipsisH className="h-5 w-5 text-neutral-300" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="h-full overflow-auto">
        <div className="w-full">
          {newConversation ? (
            <UserSuggestions
              founderSuggestions={founders!}
              investorSuggestions={investors!}
              userSearch={userSearch}
              newConversationUser={newConversationUser}
              setNewConversationUser={setNewConversationUser}
              conversations={conversations}
              setSelectedConversation={setSelectedConversation}
              setNewConversation={setNewConversation}
              newMessageRef={newMessageRef}
            />
          ) : (
            <>
              {selectedConversation ? (
                <ConversationComponent conversation={selectedConversation} />
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>
      <div className="relative flex flex-shrink-0 px-2 pb-2 pt-2">
        <input
          placeholder="Write message..."
          value={message}
          ref={newMessageRef}
          required
          className="w-full rounded-full border-2 border-border  bg-background py-2 pl-3 pr-12 outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {!(newConversation && !newConversationUser) && (
          <button
            className="absolute right-3 top-[12px] rounded-full bg-primary p-2"
            onClick={() => {
              if (newConversation) {
                createConversation();
              } else {
                sendMessage();
              }
              setMessage("");
            }}
          >
            <AiOutlineSend className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbox;
