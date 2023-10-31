import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { SlMenu } from "react-icons/sl";
import { ActiveType } from "~/types/types";
import MessageIcon from "./messageIcon";
import SearchBar from "./searchBar";
import NotificationIcon from "./notificationIcon";
import { updateMetadata } from "~/utils/helperFunctions";
import {
  HeartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const HamburgerMenu: React.FC = () => {
  const { user, isLoaded } = useUser();

  const [hamMenuOpen, setHamMenuOpen] = useState(false);

  const setFounderActive = () => {
    const unsafeMetadata = {
      investor: user!.unsafeMetadata.investor,
      founder: true,
      active: ActiveType.FOUNDER,
    };
    updateMetadata(user!, unsafeMetadata).catch((err) => {
      console.error("Error updating metadata", err);
    });
  };

  const setInvestorActive = () => {
    const unsafeMetadata = {
      investor: true,
      founder: user!.unsafeMetadata.founder,
      active: ActiveType.INVESTOR,
    };
    updateMetadata(user!, unsafeMetadata).catch((err) => {
      console.error("Error updating metadata", err);
    });
  };

  const founderContent = (
    <>
      <li>
        <Link href="/investments/create" passHref>
          <p className="whitespace-nowrap text-muted-foreground">
            Create Venture
          </p>
        </Link>
      </li>
      <li>
        <Link href="/founder/investments" passHref>
          <p className="whitespace-nowrap text-muted-foreground">
            Your Ventures
          </p>
        </Link>
      </li>
    </>
  );

  const investorContent = (
    <>
      <li>
        <Link href="/investor/jobs" passHref>
          <p className="whitespace-nowrap text-muted-foreground">My Jobs</p>
        </Link>
      </li>
    </>
  );

  const iconGroup = (
    <>
      <li>
        <NotificationIcon />
      </li>
      <li>
        <MessageIcon />
      </li>
      <li>
        <HeartIcon className="h-7 w-7 text-muted-foreground" />
      </li>
    </>
  );

  const activeContent = (
    <>
      {user?.unsafeMetadata.active == ActiveType.INVESTOR
        ? investorContent
        : founderContent}
      {iconGroup}
    </>
  );
  const inactiveContent = (
    <>
      <li>
        {user?.unsafeMetadata.investor ? (
          <Link href="/investor" passHref onClick={() => setInvestorActive()}>
            <p className="text-muted-foreground">Login as Investor</p>
          </Link>
        ) : (
          <Link href="/investor/create" passHref>
            <p className="text-muted-foreground">Become an Investor</p>
          </Link>
        )}
      </li>
      <li>
        {user?.unsafeMetadata.founder ? (
          <Link href="/founder" passHref onClick={() => setFounderActive()}>
            <p className="text-muted-foreground">Login as Founder</p>
          </Link>
        ) : (
          <Link href="/founder/create" passHref>
            <p className="text-muted-foreground">Become a Founder</p>
          </Link>
        )}
      </li>
    </>
  );
  const signedInContent = (
    <>
      {user?.unsafeMetadata.active == ActiveType.NONE
        ? inactiveContent
        : activeContent}
      <li>
        <UserButton afterSignOutUrl="/" />
      </li>
    </>
  );
  return (
    <div>
      {hamMenuOpen ? (
        <button
          type="button"
          className="text-white hover:text-gray-300 focus:outline-none"
          onClick={() => setHamMenuOpen(false)}
        >
          <XMarkIcon className="h-8 w-8 pt-1.5" />
        </button>
      ) : (
        <button
          type="button"
          className="text-white hover:text-gray-300 focus:outline-none"
          onClick={() => setHamMenuOpen(true)}
        >
          <Bars3Icon className="h-8 w-8 pt-1.5" />
        </button>
      )}

      {hamMenuOpen && (
        // <ul className="absolute flex max-w-5xl grow flex-col items-center justify-end space-x-6">
        //   <SignedIn>{signedInContent}</SignedIn>
        //   <SignedOut>
        //     <li>
        //       <SignInButton />
        //     </li>
        //     <li>
        //       <SignUpButton
        //         redirectUrl="/"
        //         unsafeMetadata={{
        //           active: "none",
        //           investor: false,
        //           founder: false,
        //         }}
        //       />
        //     </li>
        //   </SignedOut>
        // </ul>
        <div className="absolute left-0 top-[63px] z-50 flex h-full w-full flex-col ">
          <div className="flex w-full flex-col border-b-2 border-b-border bg-background p-4 ">
            <p className="text-lg">Profile</p>
            <p className="text-lg">My Jobs</p>
            <p className="text-lg">Search</p>
            <p className="text-lg">Notifications</p>
          </div>
          <div className="h-full w-full bg-black bg-opacity-50" />
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
