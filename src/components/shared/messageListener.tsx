import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { pusherClient } from "~/server/pusher";
import {
  ActiveType,
  ConversationType,
  MessageType,
  NotificationType,
} from "~/types/types";
import { toPusherKey } from "~/utils/helperFunctions";

const MessageListener: React.FC = () => {
  const { user, isLoaded } = useUser();
  // subscribe to pusher
  useEffect(() => {
    console.log("listening");
    if (isLoaded) {
      if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
        pusherClient.subscribe(toPusherKey(`founder:${user?.id}`));
      } else if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
        pusherClient.subscribe(toPusherKey(`investor:${user?.id}`));
      }
    }
    const newNotificationHandler = (notification: NotificationType) => {
      toast("New notification");
    };

    const newConversationHandler = (conversation: ConversationType) => {
      toast("new conversation");
    };

    const newMessageHandler = (message: MessageType) => {
      toast("new message");
    };

    pusherClient.bind("new-notification", newNotificationHandler);
    pusherClient.bind("new-conversation", newConversationHandler);
    pusherClient.bind("new-message", newMessageHandler);

    return () => {
      if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
        pusherClient.unsubscribe(toPusherKey(`founder:${user?.id}`));
      } else if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
        pusherClient.unsubscribe(toPusherKey(`investor:${user?.id}`));
      }
      pusherClient.unbind("new-notification", newNotificationHandler);
      pusherClient.unbind("new-conversation", newConversationHandler);
      pusherClient.unbind("new-message", newMessageHandler);
    };
  }, [user, isLoaded]);
  return <></>;
};

export default MessageListener;
