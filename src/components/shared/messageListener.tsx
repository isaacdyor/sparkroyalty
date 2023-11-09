import { useUser } from "@clerk/nextjs";
import React, { useCallback, useEffect } from "react";
import Pusher from "pusher-js";
import {
  ActiveType,
  type ConversationType,
  type MessageType,
  type NotificationType,
} from "~/types/types";
import { useGeneralContext } from "~/utils/context";
import { sortConversation, toPusherKey } from "~/utils/helperFunctions";
import { sendToast } from "~/utils/toast";
import { nanoid } from "nanoid";
import { AccountType } from "@prisma/client";
import { api } from "~/utils/api";

const MessageListener: React.FC = () => {
  const { user, isLoaded } = useUser();

  const { selectedConversation, setConversations, setNotifications } =
    useGeneralContext();

  const ctx = api.useContext();

  const refetch = () => {
    ctx.messages.getConversations.refetch();
  };

  const { mutate: markNotReadMutation } = api.messages.markNotRead.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating poopy profile:", errorMessage);
    },
  });

  // subscribe to pusher
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: "us3",
    });
    if (isLoaded) {
      if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
        pusher.subscribe(toPusherKey(`founder:${user?.id}`));
      } else if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
        pusher.subscribe(toPusherKey(`investor:${user?.id}`));
      }
    }

    const newNotificationHandler = (notification: NotificationType) => {
      const date = new Date(notification.createdAt);
      const newNotification = {
        ...notification,
        createdAt: date,
      };
      setNotifications((prevNotifications) => {
        const updatedNotifications = [
          ...(prevNotifications || []),
          newNotification,
        ];
        return updatedNotifications;
      });
      void ctx.notifications.getCurrent.invalidate();
      sendToast(notification.subject, notification.content);
    };

    const newConversationHandler = async (conversation: ConversationType) => {
      setConversations((prevConversations) => {
        const prevConversationsArray = prevConversations ?? [];

        return [conversation, ...prevConversationsArray];
      });
      if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
        sendToast(
          conversation.investorName!,
          conversation.messages![0]!.content,
          conversation.investorImageUrl
        );
      } else if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
        sendToast(
          conversation.founderName!,
          conversation.messages![0]!.content,
          conversation.founderImageUrl
        );
      }
      const response = await refetch();
      return response;
    };

    const updateRecieverMessages = (message: MessageType) => {
      let newMessage: MessageType;
      if (message.senderType === AccountType.FOUNDER) {
        newMessage = {
          content: message.content,
          createdAt: new Date(),
          id: nanoid(),
          investorId: message.investorId,
          founderId: message.founderId,
          senderType: AccountType.FOUNDER,
          senderName: user!.fullName!,
          conversationId: message.conversationId,
        };
      } else {
        newMessage = {
          content: message.content,
          createdAt: new Date(),
          id: nanoid(),
          investorId: message.investorId,
          founderId: message.founderId,
          senderType: AccountType.INVESTOR,
          senderName: user!.fullName!,
          conversationId: message.conversationId,
        };
      }

      setConversations((prevConversations) => {
        const prevConversationsArray = prevConversations ?? [];

        const unsortedArray = prevConversationsArray.map((conversation) => {
          if (conversation.id === newMessage.conversationId) {
            return {
              ...conversation,
              lastMessageAt: new Date(),
              messages: [...conversation.messages!, newMessage],
              founderSeen:
                message.senderType === AccountType.INVESTOR &&
                selectedConversation?.id !== message.conversationId
                  ? false
                  : conversation.founderSeen,
              investorSeen:
                message.senderType === AccountType.FOUNDER &&
                selectedConversation?.id !== message.conversationId
                  ? false
                  : conversation.investorSeen,
            };
          }
          return conversation;
        });
        return sortConversation(unsortedArray);
      });
    };

    const newMessageHandler = (message: MessageType) => {
      if (
        (user?.unsafeMetadata.active === ActiveType.FOUNDER &&
          message.senderType === AccountType.FOUNDER) ??
        (user?.unsafeMetadata.active === ActiveType.INVESTOR &&
          message.senderType === AccountType.INVESTOR)
      ) {
        return;
      } else {
        // send toast
        console.log("hello");
        if (message.conversationId != selectedConversation?.id) {
          sendToast(message.senderName!, message.content, message.imageUrl);
        }
        updateRecieverMessages(message);
        markNotRead(message);
      }
    };

    const markNotRead = (message: MessageType) => {
      if (selectedConversation?.id === message.conversationId) {
        return;
      } else {
        if (message.senderType === AccountType.FOUNDER) {
          markNotReadMutation({
            conversationId: message.conversationId,
            accountType: AccountType.INVESTOR,
          });
        } else if (message.senderType === AccountType.INVESTOR) {
          markNotReadMutation({
            conversationId: message.conversationId,
            accountType: AccountType.FOUNDER,
          });
        }
      }
    };

    pusher.bind("new-notification", newNotificationHandler);
    pusher.bind("new-conversation", newConversationHandler);
    pusher.bind("new-message", newMessageHandler);

    return () => {
      console.log("unsubscribing");
      if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
        pusher.unsubscribe(toPusherKey(`founder:${user?.id}`));
      } else if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
        pusher.unsubscribe(toPusherKey(`investor:${user?.id}`));
      }
      pusher.unbind("new-notification", newNotificationHandler);
      pusher.unbind("new-conversation", newConversationHandler);
      pusher.unbind("new-message", newMessageHandler);
      pusher.disconnect();
    };
  }, [user, isLoaded, selectedConversation]);
  return <></>;
};

export default MessageListener;
