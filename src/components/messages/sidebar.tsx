import React from "react";
import { FaEllipsisH } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import MiniConversation from "./miniConversation";
import MessageSearchBar from "./searchBar";
import { useMessagesContext } from "~/utils/context";

const Sidebar = () => {
  const {
    setNewConversation,
    conversationSearch,
    setConversationSearch,
    selectedConversation,
    filteredConversations,
    setSidebarOpen,
    miniConversationClick,
  } = useMessagesContext();
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
