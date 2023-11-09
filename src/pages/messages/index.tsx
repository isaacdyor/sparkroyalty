import type { GetServerSideProps, NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import LargeScreen from "~/components/messages/largeScreen";
import SmallScreen from "~/components/messages/smallScreen";
import { ActiveType, type SuggestionType } from "~/types/types";
import { api } from "~/utils/api";
import { useGeneralContext } from "~/utils/context";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { AccountType } from "@prisma/client";
import { sortConversation } from "~/utils/helperFunctions";
import { useUser } from "@clerk/nextjs";

const MessagePage: NextPage<{ active: ActiveType }> = ({ active }) => {
  // queries
  const { data, isFetched, isLoading, refetch } =
    api.messages.getConversations.useQuery();

  // state
  const {
    conversations,
    selectedConversation,
    setConversations,
    setSelectedConversation,
  } = useGeneralContext();

  const [newConversation, setNewConversation] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isBigScreen, setIsBigScreen] = useState(false);

  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  const newMessageRef = useRef<HTMLInputElement>(null);

  // initial data load and on data change
  useEffect(() => {
    if (isFetched) {
      const sortedConversations = sortConversation(data!);
      setConversations(sortedConversations);
    }
  }, [isFetched, data]);

  // keep the conversation order updated
  useEffect(() => {
    if (conversations) {
      const sortedConversations = sortConversation(conversations);
      setConversations(sortedConversations);
    }
  }, [conversations]);

  // keep the selected conversation updated
  useEffect(() => {
    if (!conversations) return;
    if (!selectedConversation) {
      if (conversations.length > 0) {
        setSelectedConversation(conversations[0]!);
      }
    } else {
      const conversation = conversations.find(
        (conversation) => conversation.id === selectedConversation?.id
      );
      setSelectedConversation(conversation ?? null);
    }
  }, [conversations, selectedConversation]);

  // focus input when new conversation is created
  useEffect(() => {
    if (newConversation ?? !newConversation) {
      inputRef.current?.focus();
    }
  }, [newConversation, newConversation]);

  // keep screen size updated
  useEffect(() => {
    const checkScreenSize = () => {
      setIsBigScreen(window.innerWidth >= 640);
    };

    window.addEventListener("resize", checkScreenSize);

    checkScreenSize();

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  if (!isFetched || isLoading) {
    return;
  }

  return (
    <>
      {isBigScreen ? (
        <LargeScreen
          active={active}
          setNewConversation={setNewConversation}
          setSidebarOpen={setSidebarOpen}
          newConversation={newConversation}
          isBigScreen={isBigScreen}
          inputRef={inputRef}
          newMessageRef={newMessageRef}
        />
      ) : (
        <SmallScreen
          active={active}
          setNewConversation={setNewConversation}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          newConversation={newConversation}
          isBigScreen={isBigScreen}
          inputRef={inputRef}
          newMessageRef={newMessageRef}
        />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in?redirect_url=" + ctx.resolvedUrl,
        permanent: false,
      },
    };
  }

  const user = await clerkClient.users.getUser(userId);
  const active = user.unsafeMetadata.active;

  return {
    props: {
      active,
    },
  };
};

export default MessagePage;
