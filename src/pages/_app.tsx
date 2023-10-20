import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "~/components/navbar/navbar";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import MessageListener from "~/components/shared/messageListener";
import { GeneralContext } from "~/utils/context";
import { useState } from "react";
import { ConversationType } from "~/types/types";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [conversations, setConversations] = useState<ConversationType[] | null>(
    null
  );
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);

  const value = {
    conversations: conversations,
    selectedConversation: selectedConversation,
    setConversations: setConversations,
    setSelectedConversation: setSelectedConversation,
  };
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
