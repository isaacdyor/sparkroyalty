import Sidebar from "./sidebar";
import Chatbox from "./chatbox";
import { ActiveType } from "~/types/types";

const SmallScreen: React.FC<{
  active: ActiveType;
  setNewConversation: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newConversation: boolean;
  isBigScreen: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  newMessageRef: React.RefObject<HTMLInputElement>;
}> = ({
  active,
  setNewConversation,
  sidebarOpen,
  setSidebarOpen,
  newConversation,
  isBigScreen,
  inputRef,
  newMessageRef,
}) => {
  return (
    <div className="flex h-[91vh] justify-center px-5 pt-4 sm:px-10">
      <div className="flex h-[95%] w-full max-w-5xl rounded border-2 border-border">
        {sidebarOpen ? (
          <div className="grow">
            <Sidebar
              setNewConversation={setNewConversation}
              setSidebarOpen={setSidebarOpen}
              active={active}
            />
          </div>
        ) : (
          <Chatbox
            newConversation={newConversation}
            isBigScreen={isBigScreen}
            setNewConversation={setNewConversation}
            setSidebarOpen={setSidebarOpen}
            active={active}
            inputRef={inputRef}
            newMessageRef={newMessageRef}
          />
        )}
      </div>
    </div>
  );
};

export default SmallScreen;
