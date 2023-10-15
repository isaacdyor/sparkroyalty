import { type RefObject, createContext, useContext } from "react";
import type {
  ActiveType,
  ConversationType,
  SuggestionType,
  InvestorType,
  FounderType,
} from "~/types/types";
import type { UserResource } from "@clerk/types";

interface MessagesContextType {
  conversations: ConversationType[] | null;
  selectedConversation: ConversationType | null;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<ConversationType | null>
  >;
  newConversation: boolean;
  setNewConversation: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setMessage: (message: string) => void;
  userSearch: string;
  setUserSearch: (search: string) => void;
  newConversationUser: SuggestionType | null;
  setNewConversationUser: React.Dispatch<
    React.SetStateAction<SuggestionType | null>
  >;
  sendMessage: () => void;
  createConversation: () => void;
  inputRef: RefObject<HTMLInputElement>;
  newMessageRef: RefObject<HTMLInputElement>;
  investors: InvestorType[] | null;
  founders: FounderType[] | null;
  active: ActiveType;
  user: UserResource | null;
  filteredConversations: ConversationType[] | null;
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  isBigScreen: boolean;
  conversationSearch: string;
  setConversationSearch: React.Dispatch<React.SetStateAction<string>>;
  miniConversationClick: (conversation: ConversationType) => void;
}

// Create your context with the defined type
export const MessagesContext = createContext<MessagesContextType | null>(null);

export const useMessagesContext = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error(
      "useMessagesContext must be used within a MessagesProvider"
    );
  }
  return context;
};
