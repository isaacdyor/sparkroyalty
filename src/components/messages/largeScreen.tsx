import Chatbox from "./chatbox";
import Sidebar from "./sidebar";

const LargeScreen = () => {
  return (
    <div className="flex h-[91vh] justify-center px-10 pt-4">
      <div className="flex h-[95%] w-full max-w-5xl rounded border-2 border-border">
        <Sidebar />
        <Chatbox />
      </div>
    </div>
  );
};

export default LargeScreen;
