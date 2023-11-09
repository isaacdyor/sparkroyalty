import { useState } from "react";
import Chatbox from "./chatbox";
import Sidebar from "./sidebar";
import { ActiveType } from "~/types/types";

const LargeScreen: React.FC<{
  active: ActiveType;
  setNewConversation: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newConversation: boolean;
  isBigScreen: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  newMessageRef: React.RefObject<HTMLInputElement>;
}> = ({
  active,
  setNewConversation,
  setSidebarOpen,
  newConversation,
  isBigScreen,
  inputRef,
  newMessageRef,
}) => {
  return (
    <div className="flex h-[91vh] justify-center px-10 pt-4">
      <div className="flex h-[95%] w-full max-w-5xl rounded border-2 border-border">
        <Sidebar
          setNewConversation={setNewConversation}
          setSidebarOpen={setSidebarOpen}
          active={active}
        />
        <Chatbox
          newConversation={newConversation}
          isBigScreen={isBigScreen}
          setNewConversation={setNewConversation}
          setSidebarOpen={setSidebarOpen}
          active={active}
          inputRef={inputRef}
          newMessageRef={newMessageRef}
        />
      </div>
    </div>
  );
};

export default LargeScreen;
