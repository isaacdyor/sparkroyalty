import { createContext, useContext } from "react";
import type {
  ActiveType,
  ConversationType,
  NotificationType,
} from "~/types/types";

interface GeneralContextType {
  conversations: ConversationType[] | null;
  selectedConversation: ConversationType | null;
  unreadMessages: boolean;
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationType[] | null>
  >;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<ConversationType | null>
  >;
  setUnreadMessages: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: NotificationType[] | null;
  setNotifications: React.Dispatch<
    React.SetStateAction<NotificationType[] | null>
  >;
}

export const GeneralContext = createContext<GeneralContextType | null>(null);

export const useGeneralContext = () => {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error(
      "useMessagesContext must be used within a MessagesProvider"
    );
  }
  return context;
};
