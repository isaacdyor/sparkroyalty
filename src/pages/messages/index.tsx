import type { GetServerSideProps, NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import LargeScreen from "~/components/messages/largeScreen";
import SmallScreen from "~/components/messages/smallScreen";
import {
  ActiveType,
  type ConversationType,
  type MessageType,
  type SuggestionType,
} from "~/types/types";
import { api } from "~/utils/api";
import { MessagesContext } from "~/utils/context";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { AccountType } from "@prisma/client";
import { pusherClient } from "~/server/pusher";
import { toPusherKey } from "~/utils/helperFunctions";
import { useUser } from "@clerk/nextjs";
import { nanoid } from "nanoid";

const MessagePage: NextPage<{ active: ActiveType }> = ({ active }) => {
  const { user, isLoaded } = useUser();

  // queries
  const { data, isFetched, isLoading, refetch } =
    api.messages.getConversations.useQuery();

  const { data: investors } = api.investors.getAll.useQuery(undefined, {
    enabled: active === ActiveType.FOUNDER,
  });

  const { data: founders } = api.founders.getAll.useQuery(undefined, {
    enabled: active === ActiveType.INVESTOR,
  });

  // mutations
  const { mutate: createConversationMutation } =
    api.messages.createConversation.useMutation({
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        console.error("Error updating poopy profile:", errorMessage);
      },
    });

  const { mutate: markReadMutation } = api.messages.markRead.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating poopy profile:", errorMessage);
    },
  });

  const { mutate: markNotReadMutation } = api.messages.markNotRead.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating poopy profile:", errorMessage);
    },
  });

  const { mutate: sendMessageMutation } = api.messages.sendMessage.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating poopy profile:", errorMessage);
    },
  });

  // state
  const [conversationSearch, setConversationSearch] = useState("");
  const [newConversation, setNewConversation] = useState(false);
  const [message, setMessage] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [conversations, setConversations] = useState<ConversationType[] | null>(
    null
  );
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);

  const [newConversationUser, setNewConversationUser] =
    useState<SuggestionType | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isBigScreen, setIsBigScreen] = useState(false);

  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  const newMessageRef = useRef<HTMLInputElement>(null);

  // sort the conversations by last message
  const sortConversation = (conversations: ConversationType[]) => {
    const sortedConversations = conversations?.sort((a, b) => {
      const aDate = new Date(a.lastMessageAt);
      const bDate = new Date(b.lastMessageAt);
      return bDate.getTime() - aDate.getTime();
    });
    return sortedConversations;
  };

  // mark the conversation as not read
  const markNotRead = useCallback(
    (message: MessageType) => {
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
    },
    [markNotReadMutation, selectedConversation?.id]
  );

  // mark the conversation as read
  const markRead = useCallback(
    (conversationId: string) => {
      if (active === ActiveType.FOUNDER) {
        markReadMutation({
          conversationId: conversationId,
          accountType: AccountType.FOUNDER,
        });
        markReadState(conversationId, AccountType.FOUNDER);
      } else if (active === ActiveType.INVESTOR) {
        markReadMutation({
          conversationId: conversationId,
          accountType: AccountType.INVESTOR,
        });
        markReadState(conversationId, AccountType.INVESTOR);
      }
    },
    [active, markReadMutation]
  );

  // change state of conversation to read
  const markReadState = (conversationId: string, accountType: AccountType) => {
    setConversations((prevConversations) => {
      const prevConversationsArray = prevConversations ?? [];

      return prevConversationsArray.map((conversation) => {
        if (conversation.id === conversationId) {
          if (accountType === AccountType.FOUNDER) {
            return {
              ...conversation,
              founderSeen: true,
            };
          } else if (accountType === AccountType.INVESTOR) {
            return {
              ...conversation,
              investorSeen: true,
            };
          }
        }
        return conversation;
      });
    });
  };

  // update the senders conversations when new conversation created
  const newConversationSender = () => {
    if (!newConversationUser) return;
    let newConversation: ConversationType;
    if (active === ActiveType.FOUNDER) {
      newConversation = {
        id: nanoid(),
        createdAt: new Date(),

        lastMessageAt: new Date(),
        founderSeen: true,
        investorSeen: false,
        founderId: user!.id,
        investorId: newConversationUser.id,
        investorName: newConversationUser.fullName,
        investorImageUrl: newConversationUser.imageUrl,
        messages: [
          {
            content: message,
            createdAt: new Date(),
            id: nanoid(),
            investorId: newConversationUser.id,
            founderId: user!.id,
            senderType: AccountType.FOUNDER,
            conversationId: nanoid(),
          },
        ],
      };
    } else if (active === ActiveType.INVESTOR) {
      newConversation = {
        id: nanoid(),
        createdAt: new Date(),

        lastMessageAt: new Date(),
        founderSeen: true,
        investorSeen: false,
        founderId: newConversationUser.id,
        investorId: user!.id,
        founderName: newConversationUser.fullName,
        founderImageUrl: newConversationUser.imageUrl,
        messages: [
          {
            content: message,
            createdAt: new Date(),
            id: nanoid(),
            investorId: user!.id,
            founderId: newConversationUser.id,
            senderType: AccountType.INVESTOR,
            conversationId: nanoid(),
          },
        ],
      };
    }
    setConversations((prevConversations) => {
      const prevConversationsArray = prevConversations ?? [];

      return [newConversation, ...prevConversationsArray];
    });
    setSelectedConversation(newConversation!);
  };

  // get the message for the sender
  const updateSenderMessages = () => {
    if (!selectedConversation) return;
    let newMessage: MessageType;
    if (active === ActiveType.FOUNDER) {
      newMessage = {
        content: message,
        createdAt: new Date(),
        id: nanoid(),
        investorId: selectedConversation?.investorId,
        founderId: selectedConversation?.founderId,
        senderType: AccountType.FOUNDER,
        conversationId: selectedConversation?.id,
      };
    } else if (active === ActiveType.INVESTOR) {
      newMessage = {
        content: message,
        createdAt: new Date(),
        id: nanoid(),
        investorId: selectedConversation?.investorId,
        founderId: selectedConversation?.founderId,
        senderType: AccountType.INVESTOR,
        conversationId: selectedConversation?.id,
      };
    }
    setConversations((prevConversations) => {
      const prevConversationsArray = prevConversations ?? [];

      return prevConversationsArray.map((conversation) => {
        if (conversation.id === newMessage.conversationId) {
          return {
            ...conversation,
            lastMessageAt: new Date(),
            messages: [...conversation.messages!, newMessage],
          };
        }
        return conversation;
      });
    });
  };

  // send the message
  const sendMessage = () => {
    updateSenderMessages();
    sendMessageMutation({
      content: message,
      recipientId:
        active === ActiveType.INVESTOR
          ? selectedConversation!.founderId
          : selectedConversation!.investorId,
      conversation: selectedConversation!,
    });
  };

  // create conversation
  const createConversation = () => {
    createConversationMutation({
      content: message,
      recipientId: newConversationUser!.id,
      senderName: user!.fullName!,
      senderImageUrl: user!.imageUrl,
    });
    newConversationSender();
    setNewConversation(false);
    setNewConversationUser(null);
  };

  // mini conversation click
  const miniConversationClick = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
    setNewConversation(false);
    setSidebarOpen(false);
  };

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

  // mark the conversation as read when selected
  useEffect(() => {
    if (
      selectedConversation &&
      ((active === ActiveType.FOUNDER && !selectedConversation.founderSeen) ??
        (active === ActiveType.INVESTOR && !selectedConversation.investorSeen))
    ) {
      markRead(selectedConversation.id);
    }
  }, [selectedConversation, active, markRead]);

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

  // subscribe to pusher
  useEffect(() => {
    if (active === ActiveType.FOUNDER) {
      pusherClient.subscribe(toPusherKey(`founder:${user?.id}`));
    } else if (active === ActiveType.INVESTOR) {
      pusherClient.subscribe(toPusherKey(`investor:${user?.id}`));
    }

    // get the message for the reciever
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

    // update conversation state for the reciever when a new conversation is created
    const newConversationReciever = (conversation: ConversationType) => {
      setConversations((prevConversations) => {
        const prevConversationsArray = prevConversations ?? [];

        return [conversation, ...prevConversationsArray];
      });
    };

    const newMessageHandler = (message: MessageType) => {
      if (
        (active === ActiveType.FOUNDER &&
          message.senderType === AccountType.FOUNDER) ??
        (active === ActiveType.INVESTOR &&
          message.senderType === AccountType.INVESTOR)
      ) {
        return;
      } else {
        updateRecieverMessages(message);
        markNotRead(message);
      }
    };

    const newConversationHandler = async (conversation: ConversationType) => {
      newConversationReciever(conversation);
      const response = await refetch();
      return response;
    };

    pusherClient.bind("incoming-message", newMessageHandler);
    pusherClient.bind("new-conversation", newConversationHandler);

    return () => {
      if (active === ActiveType.FOUNDER) {
        pusherClient.unsubscribe(toPusherKey(`founder:${user?.id}`));
      } else if (active === ActiveType.INVESTOR) {
        pusherClient.unsubscribe(toPusherKey(`investor:${user?.id}`));
      }
      pusherClient.unbind("new-conversation", newConversationHandler);
      pusherClient.unbind("incoming-message", newMessageHandler);
    };
  }, [active, user?.id, markNotRead, selectedConversation?.id, refetch]);

  // focus input when new conversation is created
  useEffect(() => {
    if (newConversation ?? !newConversationUser) {
      inputRef.current?.focus();
    }
  }, [newConversation, newConversationUser]);

  // filter the conversations by query
  const filteredConversations = conversations?.filter((conversation) =>
    active === ActiveType.FOUNDER
      ? (conversation.investor?.fullName ?? conversation.investorName!)
          .toLowerCase()
          .includes(conversationSearch.toLowerCase())
      : (conversation.founder?.fullName ?? conversation.founderName!)
          .toLowerCase()
          .includes(conversationSearch.toLowerCase())
  );

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

  const value = {
    conversations: conversations,
    selectedConversation: selectedConversation,
    setSelectedConversation: setSelectedConversation,
    newConversation: newConversation,
    setNewConversation: setNewConversation,
    message: message,
    setMessage: setMessage,
    userSearch: userSearch,
    setUserSearch: setUserSearch,
    newConversationUser: newConversationUser,
    setNewConversationUser: setNewConversationUser,
    sendMessage: sendMessage,
    createConversation: createConversation,
    inputRef: inputRef,
    newMessageRef: newMessageRef,
    investors: investors ?? null,
    founders: founders ?? null,
    active: active,
    user: user!,
    filteredConversations: filteredConversations ?? null,
    sidebarOpen: sidebarOpen,
    setSidebarOpen: setSidebarOpen,
    isBigScreen: isBigScreen,
    conversationSearch: conversationSearch,
    setConversationSearch: setConversationSearch,
    miniConversationClick: miniConversationClick,
  };

  if (!isFetched || isLoading || !isLoaded) {
    return;
  }

  return (
    <MessagesContext.Provider value={value}>
      {isBigScreen ? <LargeScreen /> : <SmallScreen />}
    </MessagesContext.Provider>
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
