import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";

const MessageSearchBar: React.FC<{
  conversationSearch: string;
  setConversationSearch: React.Dispatch<React.SetStateAction<string>>;
}> = ({ conversationSearch, setConversationSearch }) => {
  return (
    <div className="relative flex items-center">
      <AiOutlineSearch className=" absolute left-1 h-4 w-4 text-foreground" />
      <input
        className="w-full rounded-md border-2 border-input bg-background px-1 py-1 pl-6 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
        placeholder="Search"
        value={conversationSearch}
        onChange={(e) => {
          setConversationSearch(e.target.value);
        }}
      />

      {conversationSearch ? (
        <button
          type="button"
          className=" absolute right-px bg-background"
          onClick={(e) => {
            e.preventDefault();
            setConversationSearch("");
          }}
        >
          <RxCross2 className="h-5 w-5 text-foreground hover:text-foreground/70" />
        </button>
      ) : (
        <div className="absolute right-0.5 top-0 h-6 w-6"></div>
      )}
    </div>
  );
};

export default MessageSearchBar;
