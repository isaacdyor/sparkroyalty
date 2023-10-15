import type {
  ExperienceLevelType,
  ApplicationStatusType,
  AccountType,
  PaymentBasisType,
  FrequencyType,
} from "@prisma/client";

export interface InvestmentType {
  id: string;
  createdAt: Date;
  title: string;
  description: string;
  workType: string;
  workDescription: string;
  paymentBasis: PaymentBasisType;
  percent: number;
  totalPayout: number;
  currentPayout: number;
  payoutFrequency: FrequencyType;
  skills?: Array<{
    id: string;
    skill: string;
  }>;

  extraDetails: string;
  status: string;
  investorId: string | null;
  founderId: string;
  applications?: Array<ApplicationType>;
  investor?: InvestorType | null;
  founder?: FounderType | null;
}

export interface InvestorType {
  id: string;
  createdAt: Date;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  title: string;
  bio: string;
  country: string;
  educationAndExperience: string | null;
  skills?: Array<{
    id: string;
    skill: string;
    experience: ExperienceLevelType;
  }>;
  reviews?: Array<ReviewType>;
}

export interface FounderType {
  id: string;
  createdAt: Date;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  bio: string;
  country: string;
  educationAndExperience: string | null;
  investments?: Array<InvestmentType>;
  reviews?: Array<ReviewType>;
}

export interface ApplicationType {
  id: string;
  projectInterest: string;
  projectSkills: string;
  status: ApplicationStatusType;
  investorId: string;
  investmentId: string;
  investor?: InvestorType;
  investment?: InvestmentType;
}

export interface ReviewType {
  id: string;
  createdAt: Date;
  review: string;
  revieweeType: AccountType;
  stars: number;
  investorId: string;
  founderId: string;
  founder?: FounderType;
  investor?: InvestorType;
}

export interface ConversationType {
  id: string;
  createdAt: Date;
  messages?: Array<MessageType>;
  lastMessageAt: Date;
  founderSeen: boolean;
  investorSeen: boolean;
  founderId: string;
  investorId: string;
  founderName?: string;
  investorName?: string;
  founderImageUrl?: string;
  investorImageUrl?: string;
  founder?: FounderType;
  investor?: InvestorType;
}

export interface MessageType {
  id: string;
  createdAt: Date;
  content: string;
  senderType: AccountType;
  conversationId: string;
  founderId: string;
  investorId: string;
  founder?: FounderType;
  investor?: InvestorType;
}

export interface SuggestionType {
  id: string;
  fullName: string;
  imageUrl: string;
  email: string;
}

export enum ActiveType {
  NONE = "none",
  FOUNDER = "founder",
  INVESTOR = "investor",
}

export enum ProfileType {
  FOUNDER = "founder",
  INVESTOR = "investor",
}

export interface UnsafeMetadata {
  active: ActiveType;
  investor: boolean;
  founder: boolean;
}
