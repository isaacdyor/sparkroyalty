import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import {
  ActiveType,
  type ConversationType,
  type MessageType,
  type NotificationType,
} from "~/types/types";
import { useGeneralContext } from "~/utils/context";
import { toPusherKey } from "~/utils/helperFunctions";
import { sendToast } from "~/utils/toast";
import Pusher from "pusher-js";

const MessageListener: React.FC = () => {
  const { user, isLoaded } = useUser();

  const { selectedConversation } = useGeneralContext();

  // subscribe to pusher
  // useEffect(() => {
  //   if (!isLoaded) {
  //     return;
  //   }
  //   console.log("subscribing");
  //   if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
  //     pusherClient.subscribe(toPusherKey(`founder:${user?.id}`));
  //   } else if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
  //     pusherClient.subscribe(toPusherKey(`investor:${user?.id}`));
  //   }
  //   const newNotificationHandler = (notification: NotificationType) => {
  //     sendToast(notification.subject, notification.content);
  //   };

  //   const newConversationHandler = (conversation: ConversationType) => {
  //     if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
  //       sendToast(
  //         conversation.investorName!,
  //         conversation.messages![0]!.content,
  //         conversation.investorImageUrl
  //       );
  //     } else if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
  //       sendToast(
  //         conversation.founderName!,
  //         conversation.messages![0]!.content,
  //         conversation.founderImageUrl
  //       );
  //     }
  //   };

  //   const newMessageHandler = (message: MessageType) => {
  //     if (message.conversationId != selectedConversation?.id) {
  //       sendToast(message.senderName!, message.content, message.imageUrl);
  //     }
  //   };

  //   pusherClient.bind("new-notification", newNotificationHandler);
  //   pusherClient.bind("new-conversation", newConversationHandler);
  //   pusherClient.bind("new-message", newMessageHandler);

  //   return () => {
  //     console.log("unsubscribing");
  //     if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
  //       pusherClient.unsubscribe(toPusherKey(`founder:${user?.id}`));
  //     } else if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
  //       pusherClient.unsubscribe(toPusherKey(`investor:${user?.id}`));
  //     }
  //     pusherClient.unbind("new-notification", newNotificationHandler);
  //     pusherClient.unbind("new-conversation", newConversationHandler);
  //     pusherClient.unbind("new-message", newMessageHandler);
  //   };
  // }, [user, isLoaded, selectedConversation]);

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    cluster: "us3",
  });

  useEffect(() => {
    pusher.subscribe("channel");
    const handler = () => {
      console.log("event");
    };

    pusher.bind("event", handler);

    return () => {
      console.log("unsubscribing");
      pusher.unsubscribe("channel");
      pusher.unbind("event", handler);
    };
  }, []);
  return <>hello</>;
};

export default MessageListener;
