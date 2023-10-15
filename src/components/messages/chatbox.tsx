import React from "react";
import { AiOutlineSend } from "react-icons/ai";
import { FaEllipsisH } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { ActiveType } from "~/types/types";
import ConversationComponent from "./conversationComponent";
import UserSuggestions from "./userSuggestions";
import { useMessagesContext } from "~/utils/context";
import { BiArrowBack } from "react-icons/bi";

const Chatbox = () => {
  const {
    active,
    newConversation,
    setNewConversation,
    newConversationUser,
    setNewConversationUser,
    userSearch,
    setUserSearch,
    inputRef,
    founders,
    investors,
    conversations,
    selectedConversation,
    setSelectedConversation,
    newMessageRef,
    message,
    setMessage,
    createConversation,
    sendMessage,
    isBigScreen,
    setSidebarOpen,
  } = useMessagesContext();
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
              founderSuggestions={founders}
              investorSuggestions={investors}
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
