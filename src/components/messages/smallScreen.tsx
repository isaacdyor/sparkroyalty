import { useMessagesContext } from "~/utils/context";
import Sidebar from "./sidebar";
import Chatbox from "./chatbox";

const SmallScreen = () => {
  const { sidebarOpen } = useMessagesContext();

  return (
    <div className="flex h-[91vh] justify-center px-5 pt-4 sm:px-10">
      <div className="flex h-[95%] w-full max-w-5xl rounded border-2 border-border">
        {sidebarOpen ? (
          <div className="grow">
            <Sidebar />
          </div>
        ) : (
          <Chatbox />
        )}
      </div>
    </div>
  );
};

export default SmallScreen;
