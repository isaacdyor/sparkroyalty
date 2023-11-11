import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "~/components/navbar/navbar";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import MessageListener from "~/components/shared/messageListener";
import { GeneralContext } from "~/utils/context";
import { useEffect, useState } from "react";
import type { ConversationType, NotificationType } from "~/types/types";
import Pusher from "pusher-js";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [conversations, setConversations] = useState<ConversationType[] | null>(
    null
  );
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);
  const [notifications, setNotifications] = useState<NotificationType[] | null>(
    null
  );
  const [unreadMessages, setUnreadMessages] = useState(false);

  const value = {
    conversations: conversations,
    selectedConversation: selectedConversation,
    unreadMessages: unreadMessages,
    setConversations: setConversations,
    setSelectedConversation: setSelectedConversation,
    notifications: notifications,
    setNotifications: setNotifications,
    setUnreadMessages: setUnreadMessages,
  };
  console.log("Component is rendering"); // Log each render
  useEffect(() => {
    console.log("Effect is running"); // Log when useEffect runs
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: "us3",
      // Additional options if needed
    });
    const channel = pusher.subscribe("channel");

    const eventHandler = () => {
      console.log("event");
    };
    channel.bind("event", eventHandler);

    return () => {
      console.log("cleaning up");
      // Unbind the event handler
      channel.unbind("event", eventHandler);

      // Unsubscribe from the channel to avoid memory leaks
      pusher.unsubscribe("channel");

      // Disconnect from Pusher
      pusher.disconnect();
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="color-scheme" content="light dark"></meta>
      </Head>
      <ClerkProvider {...pageProps}>
        <GeneralContext.Provider value={value}>
          <Navbar />
          <Component {...pageProps} />
          <Toaster containerStyle={{}} />
          <MessageListener />
        </GeneralContext.Provider>
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
