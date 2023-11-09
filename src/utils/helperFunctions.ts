import type { UserResource } from "@clerk/types";
import type {
  ConversationType,
  InvestmentType,
  UnsafeMetadata,
} from "~/types/types";

export const timeAgo = (createdAt: Date): string => {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - createdAt.getTime();

  if (timeDifference < 1000 * 60) {
    return "Just now";
  } else if (timeDifference < 1000 * 60 * 60) {
    const minutes = Math.floor(timeDifference / (1000 * 60));
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (timeDifference < 1000 * 60 * 60 * 24) {
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (timeDifference < 1000 * 60 * 60 * 24 * 7) {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (timeDifference < 1000 * 60 * 60 * 24 * 30) {
    const weeks = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  } else {
    const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatCurrency = (value: number): string => {
  if (value >= 1000) {
    const wholePart = value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "$" + wholePart;
  } else {
    const formattedCurrency =
      "$" + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedCurrency;
  }
};

export const sliceDescription = (description: string): string => {
  if (description.length > 199) {
    return description.slice(0, 199) + "...";
  } else {
    return description;
  }
};

export const updateMetadata = async (
  user: UserResource,
  unsafeMetadata: UnsafeMetadata
): Promise<void> => {
  if (!user) {
    console.log("User is not defined");
    return;
  }
  const newData = {
    investor: unsafeMetadata.investor,
    founder: unsafeMetadata.founder,
    active: unsafeMetadata.active,
  };

  try {
    const response = await user.update({
      unsafeMetadata: newData,
    });
    if (response) {
      console.log(
        "Metadata updated successfully",
        response.unsafeMetadata.active
      );
    }
  } catch (err) {
    console.error("Error updating metadata", err);
  }
};

export const getAmountOwed = (
  earnings: number,
  investment: InvestmentType
): number => {
  const royalty = earnings * (investment.percent * 0.01);
  const amountOwed =
    investment.currentPayout + royalty > investment.totalPayout
      ? investment.totalPayout - investment.currentPayout
      : royalty;
  return parseFloat(amountOwed.toFixed(2));
};

export const toPusherKey = (key: string) => {
  return key.replace(/:/g, "__");
};

export const sortConversation = (conversations: ConversationType[]) => {
  const sortedConversations = conversations?.sort((a, b) => {
    const aDate = new Date(a.lastMessageAt);
    const bDate = new Date(b.lastMessageAt);
    return bDate.getTime() - aDate.getTime();
  });
  return sortedConversations;
};
